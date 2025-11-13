import { HackathonIdea } from '@/types'

const STORAGE_KEY = 'hackathon-ideas'

// Migrate old ideas without ideaType
const migrateIdeas = (ideas: any[]): HackathonIdea[] => {
  return ideas.map(idea => ({
    ...idea,
    ideaType: idea.ideaType || 'Hackathon idea'
  }))
}

export const getStoredIdeas = (): HackathonIdea[] => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    const ideas = JSON.parse(stored)
    const migratedIdeas = migrateIdeas(ideas)
    // Save migrated version back
    if (JSON.stringify(ideas) !== JSON.stringify(migratedIdeas)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migratedIdeas))
    }
    return migratedIdeas
  }
  return getDefaultIdeas()
}

export const saveIdeas = (ideas: HackathonIdea[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ideas))
}

export const addIdea = (idea: HackathonIdea) => {
  const ideas = getStoredIdeas()
  ideas.push(idea)
  saveIdeas(ideas)
}

export const deleteIdea = (ideaId: string) => {
  const ideas = getStoredIdeas()
  const filtered = ideas.filter(idea => idea.id !== ideaId)
  saveIdeas(filtered)
}

export const updateIdea = (ideaId: string, updates: Partial<HackathonIdea>) => {
  const ideas = getStoredIdeas()
  const index = ideas.findIndex(idea => idea.id === ideaId)
  if (index !== -1) {
    ideas[index] = { ...ideas[index], ...updates }
    saveIdeas(ideas)
  }
}

const getDefaultIdeas = (): HackathonIdea[] => {
  return [
    {
      id: 'youtube-educational-reels',
      name: 'Educational Reels Generator',
      author: 'admin',
      approved: true,
      createdAt: new Date().toISOString(),
      ideaType: 'Hackathon idea',
      visibility: 'public',
      description: 'An AI-powered app that transforms lengthy educational videos into bite-sized, engaging reels.',
      pages: [
        {
          title: 'Hackathon Pitch',
          filename: 'pitch.html',
          content: `
            <h1>Educational Reels Generator</h1>
            <h2>The Problem</h2>
            <p>Educational content on YouTube is often lengthy, making it hard for learners to quickly grasp key concepts. Students and professionals want bite-sized, engaging educational content that fits their busy schedules.</p>
            
            <h2>Our Solution</h2>
            <p>We leverage YouTube's "Most Watched" analytics to identify the most engaging segments of educational videos. Our AI filters these clips to ensure they're both educational and engaging, then transforms them into short-form content.</p>
            
            <h2>Key Features</h2>
            <ul>
              <li><strong>Smart Clipping:</strong> Automatically identifies the most watched parts of educational videos</li>
              <li><strong>AI Filtering:</strong> Ensures clips are educational and engaging</li>
              <li><strong>Personalized Roadmaps:</strong> Users specify learning goals (e.g., "web development")</li>
              <li><strong>Curated Feed:</strong> Generates a roadmap and serves relevant reels</li>
            </ul>
            
            <h2>Use Case Example</h2>
            <p>A user wants to learn web development. Our app:</p>
            <ol>
              <li>Creates a learning roadmap: HTML → Frontend → Backend</li>
              <li>Curates engaging reels for each topic</li>
              <li>Delivers bite-sized educational content in a TikTok-style feed</li>
            </ol>
            
            <h2>Market Potential</h2>
            <p>With the rise of short-form content and the growing demand for accessible education, this app bridges the gap between entertainment and learning.</p>
          `
        },
        {
          title: 'Implementation',
          filename: 'implementation.html',
          content: `
            <h1>Technical Implementation</h1>
            
            <h2>Architecture Overview</h2>
            <p>The system consists of four main components:</p>
            
            <h3>1. Data Collection Service</h3>
            <ul>
              <li>YouTube Data API v3 integration</li>
              <li>Retrieves video analytics and engagement metrics</li>
              <li>Identifies peak watch-time segments</li>
            </ul>
            
            <h3>2. AI Content Filter</h3>
            <ul>
              <li>Machine learning model trained on educational content</li>
              <li>Filters clips based on:
                <ul>
                  <li>Educational value (transcript analysis)</li>
                  <li>Engagement metrics</li>
                  <li>Visual clarity</li>
                </ul>
              </li>
              <li>Uses NLP to extract key concepts</li>
            </ul>
            
            <h3>3. Roadmap Generator</h3>
            <ul>
              <li>Takes user's learning goal as input</li>
              <li>Generates structured learning path using:
                <ul>
                  <li>Pre-defined curriculum templates</li>
                  <li>Knowledge graph of topics</li>
                  <li>Dependency mapping</li>
                </ul>
              </li>
            </ul>
            
            <h3>4. Content Delivery System</h3>
            <ul>
              <li>Mobile-first React Native app</li>
              <li>TikTok-style vertical scroll interface</li>
              <li>Progress tracking and recommendations</li>
            </ul>
            
            <h2>Tech Stack</h2>
            <ul>
              <li><strong>Frontend:</strong> React Native, Expo</li>
              <li><strong>Backend:</strong> Node.js, Express, PostgreSQL</li>
              <li><strong>AI/ML:</strong> Python, TensorFlow, OpenAI API</li>
              <li><strong>Video Processing:</strong> FFmpeg</li>
              <li><strong>APIs:</strong> YouTube Data API v3</li>
            </ul>
            
            <h2>Implementation Timeline</h2>
            <ul>
              <li><strong>Week 1-2:</strong> Data collection pipeline + API integration</li>
              <li><strong>Week 3-4:</strong> AI filter development and training</li>
              <li><strong>Week 5-6:</strong> Roadmap generator + frontend development</li>
              <li><strong>Week 7-8:</strong> Testing, optimization, and deployment</li>
            </ul>
            
            <h2>Challenges & Solutions</h2>
            <ul>
              <li><strong>Copyright Issues:</strong> Work with educational content creators, proper attribution</li>
              <li><strong>API Rate Limits:</strong> Caching strategy, efficient data fetching</li>
              <li><strong>Content Quality:</strong> Continuous AI model improvement with user feedback</li>
            </ul>
          `
        }
      ]
    },
    {
      id: 'hackathon-idea-1',
      name: 'Smart Campus Navigator',
      author: 'placeholder',
      approved: true,
      createdAt: new Date().toISOString(),
      ideaType: 'Project idea',
      visibility: 'public',
      description: 'An AR-powered mobile app for campus navigation.',
      pages: [
        {
          title: 'Overview',
          filename: 'overview.html',
          content: `
            <h1>Smart Campus Navigator</h1>
            <h2>Problem Statement</h2>
            <p>New students and visitors often struggle to navigate large university campuses, leading to missed classes and appointments.</p>
            
            <h2>Solution</h2>
            <p>An AR-powered mobile app that provides real-time navigation, building information, and crowd-sourced tips for campus locations.</p>
            
            <h2>Key Features</h2>
            <ul>
              <li>AR wayfinding overlays</li>
              <li>Real-time room availability</li>
              <li>Event notifications</li>
              <li>Accessibility routes</li>
              <li>Social features (meet-up spots, study groups)</li>
            </ul>
            
            <h2>Tech Stack</h2>
            <ul>
              <li>React Native with ARKit/ARCore</li>
              <li>Firebase for real-time data</li>
              <li>Google Maps Platform</li>
              <li>Node.js backend</li>
            </ul>
          `
        }
      ]
    },
    {
      id: 'hackathon-idea-2',
      name: 'EcoTrack - Carbon Footprint Tracker',
      author: 'placeholder',
      approved: true,
      createdAt: new Date().toISOString(),
      ideaType: 'Resume project idea',
      visibility: 'public',
      description: 'Track and reduce your carbon footprint with gamified challenges.',
      pages: [
        {
          title: 'Overview',
          filename: 'overview.html',
          content: `
            <h1>EcoTrack - Personal Carbon Footprint Tracker</h1>
            
            <h2>The Challenge</h2>
            <p>Individuals want to reduce their environmental impact but lack accessible tools to measure and track their carbon footprint in daily activities.</p>
            
            <h2>Our Solution</h2>
            <p>EcoTrack is a mobile app that automatically tracks and analyzes your carbon footprint through daily activities, providing actionable insights and gamified challenges to reduce environmental impact.</p>
            
            <h2>Features</h2>
            <ul>
              <li><strong>Automatic Tracking:</strong> Integration with transportation apps, smart home devices</li>
              <li><strong>Activity Categories:</strong> Transportation, food, energy, shopping</li>
              <li><strong>Visual Analytics:</strong> Beautiful charts showing impact over time</li>
              <li><strong>Challenges:</strong> Weekly eco-challenges with friends</li>
              <li><strong>Offset Marketplace:</strong> Direct carbon offset purchases</li>
              <li><strong>Community:</strong> Share tips and compete on leaderboards</li>
            </ul>
            
            <h2>Impact</h2>
            <p>By making carbon tracking effortless and engaging, EcoTrack empowers individuals to make environmentally conscious decisions and collectively reduce carbon emissions.</p>
            
            <h2>Tech Stack</h2>
            <ul>
              <li>Flutter for cross-platform mobile app</li>
              <li>Python/Django backend with PostgreSQL</li>
              <li>ML models for activity classification</li>
              <li>APIs: Transportation, weather, carbon databases</li>
            </ul>
          `
        }
      ]
    }
  ]
}
