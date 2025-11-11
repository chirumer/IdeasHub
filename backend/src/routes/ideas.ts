import express from 'express';
import multer from 'multer';
import JSZip from 'jszip';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';
import { requireAuth, requireAdmin } from './auth.js';
import type { HackathonIdea, AppSettings } from '../types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Project ideas directory
const PROJECT_IDEAS_DIR = path.join(__dirname, '../../project_ideas');
const SETTINGS_FILE = path.join(__dirname, '../../settings.json');

// Helper functions
async function ensureDirectoryExists() {
  try {
    await fs.access(PROJECT_IDEAS_DIR);
  } catch {
    await fs.mkdir(PROJECT_IDEAS_DIR, { recursive: true });
  }
}

async function loadSettings(): Promise<AppSettings> {
  try {
    const data = await fs.readFile(SETTINGS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { requireAdminApproval: false };
  }
}

async function saveSettings(settings: AppSettings) {
  await fs.writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2));
}

async function loadIdeas(): Promise<HackathonIdea[]> {
  await ensureDirectoryExists();
  
  const ideas: HackathonIdea[] = [];
  const entries = await fs.readdir(PROJECT_IDEAS_DIR, { withFileTypes: true });
  
  for (const entry of entries) {
    if (entry.isDirectory()) {
      try {
        const ideaPath = path.join(PROJECT_IDEAS_DIR, entry.name);
        const metadataPath = path.join(ideaPath, 'metadata.json');
        const pagesDir = path.join(ideaPath, 'pages');
        
        // Read metadata
        const metadataContent = await fs.readFile(metadataPath, 'utf-8');
        const metadata = JSON.parse(metadataContent);
        
        // Read pages in the order specified in metadata
        const pages = [];
        const metadataPages = metadata.pages || [];
        
        for (const pageMeta of metadataPages) {
          const pagePath = path.join(pagesDir, pageMeta.filename);
          try {
            const content = await fs.readFile(pagePath, 'utf-8');
            pages.push({
              title: pageMeta.title,
              content,
              filename: pageMeta.filename
            });
          } catch (error) {
            console.error(`Error loading page ${pageMeta.filename}:`, error);
          }
        }
        
        ideas.push({
          id: entry.name,
          name: metadata.name,
          author: metadata.author,
          description: metadata.description || '',
          visibility: metadata.visibility || 'public',
          approved: metadata.approved !== undefined ? metadata.approved : true,
          createdAt: metadata.createdAt || new Date().toISOString(),
          pages
        });
      } catch (error) {
        console.error(`Error loading idea ${entry.name}:`, error);
      }
    }
  }
  
  return ideas;
}

async function saveIdea(idea: HackathonIdea) {
  await ensureDirectoryExists();
  
  const ideaDir = path.join(PROJECT_IDEAS_DIR, idea.id);
  const pagesDir = path.join(ideaDir, 'pages');
  
  // Create directories
  await fs.mkdir(ideaDir, { recursive: true });
  await fs.mkdir(pagesDir, { recursive: true });
  
  // Save metadata
  const metadata = {
    name: idea.name,
    author: idea.author,
    description: idea.description,
    visibility: idea.visibility,
    approved: idea.approved,
    createdAt: idea.createdAt,
    pages: idea.pages.map(p => ({ title: p.title, filename: p.filename }))
  };
  await fs.writeFile(
    path.join(ideaDir, 'metadata.json'),
    JSON.stringify(metadata, null, 2)
  );
  
  // Save pages
  for (const page of idea.pages) {
    await fs.writeFile(
      path.join(pagesDir, page.filename),
      page.content
    );
  }
}

async function deleteIdea(ideaId: string) {
  const ideaPath = path.join(PROJECT_IDEAS_DIR, ideaId);
  await fs.rm(ideaPath, { recursive: true, force: true });
}

// Helper to check if user can view an idea
function canViewIdea(idea: HackathonIdea, username: string | undefined, role: string | undefined): boolean {
  // Admins can see everything
  if (role === 'admin') return true;
  
  // Must be approved for non-admins
  if (!idea.approved) return false;
  
  // Check visibility
  if (idea.visibility === 'public') return true;
  if (idea.visibility === 'private') {
    // Only author can see private ideas
    return username === idea.author;
  }
  // visibility is array of usernames
  if (Array.isArray(idea.visibility)) {
    return username !== undefined && idea.visibility.includes(username);
  }
  
  return false;
}

// Routes

// Get context file for upload modal
router.get('/context-file', async (req, res) => {
  try {
    const contextPath = path.join(__dirname, '../../hackathon-ideas-context.md');
    res.sendFile(contextPath);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to load context file', message: error.message });
  }
});

// Get all ideas (public route - no auth required)
router.get('/', async (req, res) => {
  try {
    const ideas = await loadIdeas();
    const user = req.session.user;
    
    // Filter ideas based on visibility and approval
    const filteredIdeas = ideas.filter(idea => 
      canViewIdea(idea, user?.username, user?.role)
    );
    
    res.json(filteredIdeas);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to load ideas', message: error.message });
  }
});

// Get single idea (public route - no auth required)
router.get('/:id', async (req, res) => {
  try {
    const ideas = await loadIdeas();
    const idea = ideas.find(i => i.id === req.params.id);
    
    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }
    
    const user = req.session.user;
    if (!canViewIdea(idea, user?.username, user?.role)) {
      return res.status(403).json({ error: 'You do not have permission to view this idea' });
    }
    
    res.json(idea);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to load idea', message: error.message });
  }
});

// Upload new idea
router.post('/upload', requireAuth, upload.single('zip'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const user = req.session.user!;
    const settings = await loadSettings();
    
    // Load and validate zip
    const zip = await JSZip.loadAsync(req.file.buffer);
    
    // Find root folder
    const files = Object.keys(zip.files);
    const rootFolder = files[0].split('/')[0];
    
    // Validate structure
    const metadataFile = zip.file(`${rootFolder}/metadata.json`);
    if (!metadataFile) {
      return res.status(400).json({ error: 'Missing metadata.json' });
    }
    
    const metadataContent = await metadataFile.async('string');
    const metadata = JSON.parse(metadataContent);
    
    if (!metadata.name || !metadata.author || !metadata.description || !metadata.visibility || !metadata.pages || !Array.isArray(metadata.pages)) {
      return res.status(400).json({ error: 'Invalid metadata.json format. Required fields: name, author, description, visibility, pages (array with title and filename)' });
    }
    
    // Validate visibility
    if (metadata.visibility !== 'public' && metadata.visibility !== 'private' && !Array.isArray(metadata.visibility)) {
      return res.status(400).json({ error: 'visibility must be "public", "private", or an array of usernames' });
    }
    
    // Validate pages array
    for (const page of metadata.pages) {
      if (!page.title || !page.filename) {
        return res.status(400).json({ error: 'Each page in metadata must have title and filename' });
      }
    }
    
    // Check pages folder
    const pagesFolder = zip.folder(`${rootFolder}/pages`);
    if (!pagesFolder) {
      return res.status(400).json({ error: 'Missing pages folder' });
    }
    
    // Extract pages in order specified by metadata
    const pages = [];
    for (const pageMeta of metadata.pages) {
      const pageFile = zip.file(`${rootFolder}/pages/${pageMeta.filename}`);
      if (!pageFile) {
        return res.status(400).json({ error: `Page file ${pageMeta.filename} specified in metadata not found` });
      }
      
      const content = await pageFile.async('string');
      
      // Validate HTML has h1 tag
      if (!content.match(/<h1[^>]*>.*?<\/h1>/i)) {
        return res.status(400).json({ error: `Page ${pageMeta.filename} missing <h1> tag` });
      }
      
      pages.push({
        title: pageMeta.title,
        content,
        filename: pageMeta.filename
      });
    }
    
    // Create idea object
    const idea: HackathonIdea = {
      id: rootFolder.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      name: metadata.name,
      author: user.username,
      description: metadata.description,
      visibility: metadata.visibility,
      approved: user.role === 'admin' || !settings.requireAdminApproval,
      createdAt: new Date().toISOString(),
      pages
    };
    
    // Save idea
    await saveIdea(idea);
    
    res.json({
      message: 'Idea uploaded successfully',
      idea,
      requiresApproval: settings.requireAdminApproval && user.role !== 'admin'
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload idea', message: error.message });
  }
});

// Generate idea with AI
router.post('/generate', requireAuth, upload.single('file'), async (req, res) => {
  try {
    const user = req.session.user!;
    const settings = await loadSettings();
    
    // Get description from either text or uploaded file
    let description = req.body.description || '';
    
    if (req.file) {
      // If file uploaded, read its content
      description = req.file.buffer.toString('utf-8');
    }
    
    if (!description || description.trim().length === 0) {
      return res.status(400).json({ error: 'Description is required' });
    }
    
    if (description.length > 5000) {
      return res.status(400).json({ error: 'Description too long (max 5000 characters)' });
    }
    
    // Generate idea using OpenAI
    const prompt = `You are an expert at creating detailed hackathon project ideas. Given the following idea description, generate a complete hackathon project with:

1. A catchy, professional name
2. A brief 1-2 sentence description
3. 2-3 detailed pages of content (each page should be well-structured HTML with proper headings and content)

USER IDEA DESCRIPTION:
${description}

RESPOND WITH VALID JSON ONLY (no markdown, no code blocks, just raw JSON) in this EXACT format:
{
  "name": "Project Name Here",
  "description": "Brief 1-2 sentence description",
  "pages": [
    {
      "title": "Overview",
      "filename": "overview.html",
      "content": "<h1>Overview</h1>\\n<p>Full HTML content here...</p>\\n<h2>Section</h2>\\n<p>More content...</p>"
    },
    {
      "title": "Implementation",
      "filename": "implementation.html",
      "content": "<h1>Implementation</h1>\\n<h2>Technical Stack</h2>\\n<p>Content here...</p>"
    }
  ]
}

IMPORTANT RULES:
- Generate 2-3 pages with meaningful, detailed content
- Each page must have a title, filename (lowercase-with-hyphens.html), and content
- Content must be valid HTML starting with <h1> tag
- Make it professional, detailed, and hackathon-ready
- Include technical details, features, and implementation ideas
- Response must be VALID JSON only (no markdown code blocks)`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a hackathon project idea generator. Always respond with valid JSON only, no markdown formatting."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 3000
    });
    
    const responseText = completion.choices[0]?.message?.content || '';
    
    // Parse AI response
    let generatedData;
    try {
      // Remove markdown code blocks if present
      const jsonText = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      generatedData = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Failed to parse AI response:', responseText);
      return res.status(500).json({ error: 'AI generated invalid response format' });
    }
    
    // Validate generated data
    if (!generatedData.name || !generatedData.description || !Array.isArray(generatedData.pages) || generatedData.pages.length === 0) {
      return res.status(500).json({ error: 'AI generated incomplete idea structure' });
    }
    
    // Validate pages
    for (const page of generatedData.pages) {
      if (!page.title || !page.filename || !page.content) {
        return res.status(500).json({ error: 'AI generated invalid page structure' });
      }
      if (!page.content.match(/<h1[^>]*>.*?<\/h1>/i)) {
        return res.status(500).json({ error: `Generated page ${page.title} missing <h1> tag` });
      }
    }
    
    // Create idea ID from name
    const ideaId = generatedData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    
    // Check if idea with same ID already exists
    const existingIdeas = await loadIdeas();
    if (existingIdeas.some(i => i.id === ideaId)) {
      return res.status(400).json({ error: 'An idea with a similar name already exists. Please try a different description.' });
    }
    
    // Create idea object
    const idea: HackathonIdea = {
      id: ideaId,
      name: generatedData.name,
      author: user.username,
      description: generatedData.description,
      visibility: 'public', // Default to public for AI-generated ideas
      approved: user.role === 'admin' || !settings.requireAdminApproval,
      createdAt: new Date().toISOString(),
      pages: generatedData.pages.map((p: any) => ({
        title: p.title,
        content: p.content,
        filename: p.filename
      }))
    };
    
    // Save idea
    await saveIdea(idea);
    
    res.json({
      message: 'Idea generated successfully',
      idea,
      requiresApproval: settings.requireAdminApproval && user.role !== 'admin'
    });
  } catch (error: any) {
    console.error('AI generation error:', error);
    res.status(500).json({ error: 'Failed to generate idea', message: error.message });
  }
});

// Update idea (approve/unapprove)
router.patch('/:id', requireAdmin, async (req, res) => {
  try {
    const ideas = await loadIdeas();
    const idea = ideas.find(i => i.id === req.params.id);
    
    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }
    
    if (req.body.approved !== undefined) {
      idea.approved = req.body.approved;
      await saveIdea(idea);
    }
    
    res.json({ message: 'Idea updated successfully', idea });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update idea', message: error.message });
  }
});

// Delete idea (admin or author)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const ideas = await loadIdeas();
    const idea = ideas.find(i => i.id === req.params.id);
    
    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }
    
    const user = req.session.user!;
    // Allow if admin or if author of the idea
    if (user.role !== 'admin' && user.username !== idea.author) {
      return res.status(403).json({ error: 'You do not have permission to delete this idea' });
    }
    
    await deleteIdea(req.params.id);
    res.json({ message: 'Idea deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete idea', message: error.message });
  }
});

// Get settings
router.get('/settings/app', requireAuth, async (req, res) => {
  try {
    const settings = await loadSettings();
    res.json(settings);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to load settings', message: error.message });
  }
});

// Update settings
router.put('/settings/app', requireAdmin, async (req, res) => {
  try {
    const settings: AppSettings = {
      requireAdminApproval: req.body.requireAdminApproval ?? false
    };
    await saveSettings(settings);
    res.json({ message: 'Settings updated successfully', settings });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update settings', message: error.message });
  }
});

// Add a page to an idea with AI generation (author only)
router.post('/:id/pages', requireAuth, async (req, res) => {
  try {
    const { description, title } = req.body;
    
    if (!description || !title) {
      return res.status(400).json({ error: 'description and title are required' });
    }
    
    const ideas = await loadIdeas();
    const idea = ideas.find(i => i.id === req.params.id);
    
    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }
    
    const user = req.session.user!;
    // Only author can add pages
    if (user.username !== idea.author) {
      return res.status(403).json({ error: 'Only the author can add pages to this idea' });
    }
    
    // Generate page content with OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that creates detailed, well-structured HTML content for hackathon project pages. Generate content using only HTML tags (h1, h2, h3, p, ul, li, ol, strong, em). Do not include <html>, <head>, or <body> tags. Start with an <h1> tag for the page title."
        },
        {
          role: "user",
          content: `Create a detailed page for a hackathon project called "${idea.name}". The project description is: "${idea.description}". 

The page title should be: "${title}"

The user wants this page to cover: ${description}

Create comprehensive, engaging content that would be suitable for a hackathon project showcase.`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });
    
    const content = completion.choices[0].message.content || '<h1>Error</h1><p>Failed to generate content</p>';
    
    // Create filename from title
    const filename = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.html';
    
    // Add page to idea
    idea.pages.push({
      title,
      content,
      filename
    });
    
    // Save idea
    await saveIdea(idea);
    
    res.json({
      message: 'Page added successfully',
      page: { title, filename }
    });
  } catch (error: any) {
    console.error('Add page error:', error);
    res.status(500).json({ error: 'Failed to add page', message: error.message });
  }
});

// Delete a page from an idea (author only)
router.delete('/:id/pages/:filename', requireAuth, async (req, res) => {
  try {
    const ideas = await loadIdeas();
    const idea = ideas.find(i => i.id === req.params.id);
    
    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }
    
    const user = req.session.user!;
    // Only author can delete pages
    if (user.username !== idea.author) {
      return res.status(403).json({ error: 'Only the author can delete pages from this idea' });
    }
    
    const pageIndex = idea.pages.findIndex(p => p.filename === req.params.filename);
    if (pageIndex === -1) {
      return res.status(404).json({ error: 'Page not found' });
    }
    
    // Prevent deleting the last page
    if (idea.pages.length === 1) {
      return res.status(400).json({ error: 'Cannot delete the last page. An idea must have at least one page.' });
    }
    
    // Remove page
    idea.pages.splice(pageIndex, 1);
    
    // Delete the HTML file
    const ideaDir = path.join(PROJECT_IDEAS_DIR, idea.id);
    const pagePath = path.join(ideaDir, 'pages', req.params.filename);
    try {
      await fs.unlink(pagePath);
    } catch (error) {
      console.error('Error deleting page file:', error);
      // Continue even if file deletion fails
    }
    
    // Save updated idea
    await saveIdea(idea);
    
    res.json({ message: 'Page deleted successfully' });
  } catch (error: any) {
    console.error('Delete page error:', error);
    res.status(500).json({ error: 'Failed to delete page', message: error.message });
  }
});

export default router;
