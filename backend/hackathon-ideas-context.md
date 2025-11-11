# Hackathon Ideas Hub - Submission Guide

## Structure Requirements

To add a new hackathon idea to the website, create a folder with the following structure:

```
your-idea-name/
├── metadata.json
└── pages/
    ├── page1.html
    ├── page2.html
    └── ...
```

## metadata.json Format

The `metadata.json` file is the core of your submission. It must include:

```json
{
  "name": "Your Hackathon Idea Name",
  "author": "your-username",
  "description": "A brief, compelling description of your idea (1-2 sentences). This will appear on idea cards and search results.",
  "visibility": "public",
  "pages": [
    {
      "title": "Page Title 1",
      "filename": "page1.html"
    },
    {
      "title": "Page Title 2",
      "filename": "page2.html"
    }
  ]
}
```

### Required Fields

- **name** (string): The title of your hackathon idea
- **author** (string): Your username (must match your logged-in username)
- **description** (string): A concise description of your idea (recommended: 100-200 characters)
- **visibility** (string or array): Controls who can view your idea
  - `"public"`: Everyone can see your idea (recommended)
  - `"private"`: Only you can see your idea
  - `["username1", "username2"]`: Only specified users can see your idea
- **pages** (array): List of pages in your idea submission
  - Each page must have:
    - **title** (string): The display name for the page
    - **filename** (string): The HTML file name (must match a file in the `pages/` folder)

### Example metadata.json

```json
{
  "name": "AI-Powered Study Buddy",
  "author": "johndoe",
  "description": "An intelligent study companion that creates personalized learning paths and generates practice questions using GPT-4.",
  "visibility": "public",
  "pages": [
    {
      "title": "Project Overview",
      "filename": "overview.html"
    },
    {
      "title": "Technical Implementation",
      "filename": "implementation.html"
    },
    {
      "title": "Demo & Results",
      "filename": "demo.html"
    }
  ]
}
```

## HTML Page Format

Each HTML page should contain ONLY the content (no `<html>`, `<head>`, or `<body>` tags).

### Requirements

- Start with an `<h1>` tag for the page title (should match the title in metadata.json)
- Use semantic HTML tags: `<h2>`, `<h3>`, `<p>`, `<ul>`, `<ol>`, `<li>`, `<strong>`, `<em>`, etc.
- Keep it clean and well-structured

### Example HTML Page

**overview.html**:
```html
<h1>Project Overview</h1>

<h2>The Problem</h2>
<p>Students often struggle to create effective study plans and lack personalized practice materials tailored to their learning style.</p>

<h2>Our Solution</h2>
<p>AI-Powered Study Buddy uses machine learning to:</p>
<ul>
  <li>Analyze your learning patterns and preferences</li>
  <li>Generate customized study schedules</li>
  <li>Create practice questions based on your weak areas</li>
  <li>Provide real-time feedback and explanations</li>
</ul>

<h2>Key Features</h2>
<ul>
  <li><strong>Smart Scheduling:</strong> AI-optimized study plans that adapt to your progress</li>
  <li><strong>Question Generator:</strong> Unlimited practice questions on any topic</li>
  <li><strong>Progress Tracking:</strong> Visual dashboards showing your improvement</li>
  <li><strong>Multi-modal Learning:</strong> Text, video, and interactive content</li>
</ul>
```

## Visibility Options

### Public Ideas
```json
{
  "visibility": "public"
}
```
Anyone (even non-logged-in users) can view your idea. Perfect for sharing your work!

### Private Ideas
```json
{
  "visibility": "private"
}
```
Only you can view your idea. Useful for works-in-progress or personal projects.

### Shared with Specific Users
```json
{
  "visibility": ["teammate1", "teammate2", "mentor"]
}
```
Only the specified users (by username) can view your idea. Great for team projects or getting feedback from specific people.

## Submission Process

1. **Prepare your content**: Write your idea pages in HTML format
2. **Create metadata.json**: Fill in all required fields with accurate information
3. **Organize files**: Place all HTML files in a `pages/` subfolder
4. **Zip it up**: Create a zip file containing:
   - `your-idea-name/` (folder)
     - `metadata.json`
     - `pages/` (folder with all HTML files)
5. **Upload**: Use the Upload button in the app to submit your zip file

## Tips for Great Submissions

### Description Best Practices
- Keep it concise (100-200 characters)
- Focus on the value proposition
- Make it engaging and clear
- Avoid jargon unless necessary

### Content Structure
- Start with the problem you're solving
- Explain your solution clearly
- Include technical details
- Show results, demos, or mockups if available
- End with impact or future plans

### Page Organization
- **Page 1**: Overview/Pitch (problem, solution, key features)
- **Page 2**: Technical details (architecture, tech stack, implementation)
- **Page 3+**: Additional pages for demo, results, team, etc.

### Formatting Tips
- Use headings (`<h2>`, `<h3>`) to structure content
- Use bullet points for lists of features or benefits
- Use `<strong>` to emphasize key points
- Keep paragraphs concise and readable

## After Submission

### Approval Process
- **Admins**: Your ideas are automatically approved
- **Hackers**: Ideas may require admin approval (depending on site settings)

### Visibility
- Your idea will be visible according to the visibility setting you chose
- **Public ideas**: Appear in search and browse for everyone
- **Private ideas**: Only visible to you
- **Shared ideas**: Only visible to specified users

### Managing Your Idea
Once submitted, you can:
- **View your idea**: See how it appears to others
- **Add pages**: Use AI to generate new pages (click the + button on your idea page)
- **Delete pages**: Remove pages you no longer want (via settings icon)
- **Delete idea**: Remove your entire submission if needed

## Need Help?

If you encounter issues:
1. Ensure your metadata.json is valid JSON (use a JSON validator)
2. Check that all filenames in metadata match actual files
3. Verify HTML pages start with `<h1>` tags
4. Make sure your zip file structure matches the required format

Happy hacking! 🚀
