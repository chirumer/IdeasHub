import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_IDEAS_DIR = path.join(__dirname, '../project_ideas');

const defaultIdeas = [
  {
    id: 'educational-reels-generator',
    name: 'Educational Reels Generator',
    author: 'admin',
    description: 'An AI-powered app that transforms lengthy educational videos into bite-sized, engaging reels tailored to personalized learning roadmaps.',
    visibility: 'public' as const,
    approved: true,
    createdAt: '2025-11-11T00:00:00.000Z',
    pages: [
      {
        title: 'Hackathon Pitch',
        filename: 'hackathon-pitch.html',
        content: `<h1>Hackathon Pitch</h1>

<h2>Educational Reels Generator</h2>

<h3>The Problem</h3>
<p>Educational content on YouTube is often lengthy, making it hard for learners to quickly grasp key concepts. Students and professionals want bite-sized, engaging educational content that fits their busy schedules.</p>

<h3>Our Solution</h3>
<p>YouTube gives most watched graph for videos. Maybe we can clip the most watched parts of educational videos, filter it by AI to check if it's engaging. We can make an app for a Hackathon that generates educational and engaging reels.</p>

<h3>How It Works</h3>
<p>The user can briefly specify their educational goal in our app. For eg. To learn web development. We will generate a roadmap of topics to learn web development eg. HTML then front-end then backend. And in our app it shows reels related to the roadmap.</p>

<h3>Key Features</h3>
<ul>
  <li><strong>Smart Clipping:</strong> Automatically identifies the most watched parts of educational videos</li>
  <li><strong>AI Filtering:</strong> Ensures clips are both educational and engaging</li>
  <li><strong>Personalized Roadmaps:</strong> Users specify learning goals (e.g., "web development")</li>
  <li><strong>Curated Feed:</strong> Generates a roadmap and serves relevant reels</li>
</ul>

<h3>Use Case Example</h3>
<p>A user wants to learn web development. Our app:</p>
<ol>
  <li>Creates a roadmap: HTML → CSS → JavaScript → Frontend Frameworks → Backend</li>
  <li>Finds top educational videos for each topic</li>
  <li>Identifies the most-watched segments using YouTube analytics</li>
  <li>AI filters these segments for educational value and engagement</li>
  <li>Transforms them into short-form content (reels)</li>
  <li>Serves them in the app following the roadmap sequence</li>
</ol>`
      },
      {
        title: 'Implementation',
        filename: 'implementation.html',
        content: `<h1>Implementation</h1>

<h2>Technical Architecture</h2>

<h3>1. Data Collection Layer</h3>
<ul>
  <li><strong>YouTube API Integration:</strong> Access video analytics and "Most Watched" graphs</li>
  <li><strong>Video Download:</strong> Use youtube-dl or similar tools to fetch video segments</li>
  <li><strong>Metadata Extraction:</strong> Collect view counts, timestamps, and engagement metrics</li>
</ul>

<h3>2. AI Processing Engine</h3>
<ul>
  <li><strong>Content Analysis:</strong> Use GPT-4 or Claude to analyze transcript relevance</li>
  <li><strong>Engagement Scoring:</strong> ML model to rate educational value + engagement</li>
  <li><strong>Clip Selection:</strong> Identify 30-90 second segments that are self-contained</li>
  <li><strong>Quality Filter:</strong> Ensure audio/video quality meets standards</li>
</ul>

<h3>3. Roadmap Generator</h3>
<ul>
  <li><strong>Goal Processing:</strong> Parse user's learning objective</li>
  <li><strong>Curriculum Creation:</strong> AI generates learning path with dependencies</li>
  <li><strong>Content Matching:</strong> Map roadmap topics to available video clips</li>
</ul>

<h3>4. Mobile App (React Native)</h3>
<ul>
  <li><strong>Onboarding:</strong> User specifies learning goals</li>
  <li><strong>Feed Interface:</strong> TikTok-style vertical scroll for reels</li>
  <li><strong>Progress Tracking:</strong> Visual roadmap showing completion</li>
  <li><strong>Engagement Features:</strong> Save, share, and note-taking</li>
</ul>

<h2>Tech Stack</h2>
<ul>
  <li><strong>Frontend:</strong> React Native (iOS/Android)</li>
  <li><strong>Backend:</strong> Node.js + Express</li>
  <li><strong>AI/ML:</strong> OpenAI GPT-4, Python ML models</li>
  <li><strong>Video Processing:</strong> FFmpeg</li>
  <li><strong>Database:</strong> PostgreSQL + Redis cache</li>
  <li><strong>Storage:</strong> AWS S3 for video clips</li>
  <li><strong>APIs:</strong> YouTube Data API v3</li>
</ul>

<h2>Development Timeline</h2>
<p><strong>Week 1-2:</strong> YouTube API integration and data collection</p>
<p><strong>Week 3-4:</strong> AI content analysis and clip generation</p>
<p><strong>Week 5-6:</strong> Roadmap generator and matching algorithm</p>
<p><strong>Week 7-8:</strong> Mobile app development and testing</p>

<h2>Challenges & Solutions</h2>
<ul>
  <li><strong>Challenge:</strong> YouTube API rate limits
    <br><strong>Solution:</strong> Cache popular content, implement smart batching
  </li>
  <li><strong>Challenge:</strong> Copyright and fair use
    <br><strong>Solution:</strong> Work with creators, attribute properly, stay within fair use guidelines
  </li>
  <li><strong>Challenge:</strong> Maintaining context in short clips
    <br><strong>Solution:</strong> AI ensures clips are self-contained, add brief context cards
  </li>
</ul>`
      }
    ]
  },
  {
    id: 'smart-campus-navigator',
    name: 'Smart Campus Navigator',
    author: 'admin',
    description: 'An AR-powered mobile app that helps students and visitors navigate university campuses with real-time directions, building information, and event discovery.',
    visibility: 'public' as const,
    approved: true,
    createdAt: '2025-11-11T00:00:00.000Z',
    pages: [
      {
        title: 'Overview',
        filename: 'overview.html',
        content: `<h1>Smart Campus Navigator</h1>

<h2>Overview</h2>
<p>An AR-powered mobile application that helps students navigate large university campuses with real-time directions, building information, and social features.</p>

<h2>Key Features</h2>
<ul>
  <li><strong>AR Navigation:</strong> Point your phone to see directional arrows overlaid on the real world</li>
  <li><strong>Indoor Mapping:</strong> Navigate inside buildings to find classrooms, labs, and offices</li>
  <li><strong>Class Schedule Integration:</strong> Automatic routing to your next class</li>
  <li><strong>Social Features:</strong> Find friends on campus, share locations, meet up spots</li>
  <li><strong>Campus Info:</strong> Building hours, cafeteria menus, event locations</li>
  <li><strong>Accessibility:</strong> Wheelchair-friendly routes, elevator locations</li>
</ul>

<h2>Target Users</h2>
<ul>
  <li>New students unfamiliar with campus</li>
  <li>Visitors and prospective students</li>
  <li>Faculty and staff</li>
  <li>Event attendees</li>
</ul>

<h2>Technology</h2>
<ul>
  <li>ARCore/ARKit for augmented reality</li>
  <li>OpenStreetMap for campus mapping</li>
  <li>React Native for cross-platform development</li>
  <li>Firebase for real-time features</li>
</ul>

<h2>Monetization</h2>
<ul>
  <li>Campus dining promotions</li>
  <li>Event notifications</li>
  <li>Bookstore partnerships</li>
  <li>Premium features for universities</li>
</ul>`
      }
    ]
  },
  {
    id: 'ecotrack-carbon-footprint-tracker',
    name: 'EcoTrack - Carbon Footprint Tracker',
    author: 'admin',
    description: 'A personal carbon footprint tracking app that automatically calculates your environmental impact from daily activities and provides actionable reduction strategies.',
    visibility: 'public' as const,
    approved: true,
    createdAt: '2025-11-11T00:00:00.000Z',
    pages: [
      {
        title: 'Overview',
        filename: 'overview.html',
        content: `<h1>EcoTrack - Carbon Footprint Tracker</h1>

<h2>Mission</h2>
<p>Help individuals understand and reduce their carbon footprint through automated tracking, insights, and actionable recommendations.</p>

<h2>How It Works</h2>
<ol>
  <li><strong>Connect Accounts:</strong> Link credit cards, transportation apps, utility bills</li>
  <li><strong>Automatic Tracking:</strong> AI categorizes purchases and calculates carbon impact</li>
  <li><strong>Get Insights:</strong> See breakdown by category (transport, food, energy, goods)</li>
  <li><strong>Take Action:</strong> Receive personalized recommendations to reduce footprint</li>
  <li><strong>Track Progress:</strong> Monitor improvements over time</li>
</ol>

<h2>Key Features</h2>
<ul>
  <li><strong>Smart Categorization:</strong> ML models identify eco-impact of purchases</li>
  <li><strong>Carbon Calculator:</strong> Database of carbon costs for 10,000+ items/activities</li>
  <li><strong>Goal Setting:</strong> Set reduction targets and track progress</li>
  <li><strong>Offset Marketplace:</strong> Purchase verified carbon offsets directly in-app</li>
  <li><strong>Social Challenges:</strong> Compete with friends on eco-friendly actions</li>
  <li><strong>Impact Visualization:</strong> See your impact in relatable terms (trees planted equivalent)</li>
</ul>

<h2>Data Sources</h2>
<ul>
  <li>Bank/credit card transactions (via Plaid)</li>
  <li>Ride-sharing apps (Uber, Lyft)</li>
  <li>Utility providers (electricity, gas, water)</li>
  <li>Grocery loyalty programs</li>
  <li>Flight booking data</li>
</ul>

<h2>Revenue Model</h2>
<ul>
  <li>Freemium subscription ($4.99/month premium)</li>
  <li>Commission on carbon offset purchases</li>
  <li>Partnerships with eco-friendly brands</li>
  <li>B2B corporate carbon tracking tools</li>
</ul>

<h2>Impact Potential</h2>
<p>Studies show that people who track their carbon footprint reduce it by 15-20% within the first year. With 1 million users, we could offset equivalent to taking 30,000 cars off the road annually.</p>`
      }
    ]
  }
];

async function initializeIdeas() {
  console.log('Initializing default hackathon ideas...');
  
  // Ensure project_ideas directory exists
  await fs.mkdir(PROJECT_IDEAS_DIR, { recursive: true });
  
  for (const idea of defaultIdeas) {
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
    
    console.log(`✓ Created: ${idea.name}`);
  }
  
  console.log('\n✅ Default ideas initialized successfully!');
}

initializeIdeas().catch(console.error);
