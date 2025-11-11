# Hackathon Ideas Hub

A modern, feature-rich web application for managing and exploring hackathon ideas with multiple themes, authentication, and AI chat integration.

## Features

- 🔐 **Authentication System**: Two-tier access (Admin/Hacker) with persistent login
- 🎨 **Multiple Themes**: Light, Dark, Ocean, Sunset, Forest, and Purple Haze themes
- 📚 **Project Management**: Browse, search, and view hackathon ideas
- 💬 **AI Chat**: Placeholder AI assistant for discussing ideas
- 📤 **Upload System**: Zip-based project upload with strict validation
- ⚙️ **Admin Controls**: Delete ideas and manage approval workflows
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices

## Demo Credentials

**Admin Account:**
- Username: `admin`
- Password: `chiru`

**Hacker Account:**
- Username: `hacker`
- Password: `pragmanchiru`

## Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **UI Library**: shadcn/ui components
- **Styling**: TailwindCSS with custom themes
- **Routing**: React Router v6
- **Icons**: Lucide React
- **File Processing**: JSZip

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
project_ideas/          # Folder for storing hackathon ideas
src/
├── components/         # React components
│   ├── ui/            # shadcn UI components
│   ├── Navbar.tsx
│   ├── ThemeSelector.tsx
│   ├── UploadModal.tsx
│   ├── AdminSettingsModal.tsx
│   └── AIChatModal.tsx
├── contexts/          # React contexts for state management
├── lib/               # Utility functions
├── pages/             # Page components
├── types/             # TypeScript type definitions
└── App.tsx            # Main application component
```

## Uploading New Ideas

1. Click the "Upload" button in the navigation bar
2. Download the context file to understand the required structure
3. Create your idea following the structure:
   ```
   your-idea-name/
   ├── metadata.json
   └── pages/
       ├── page1.html
       └── page2.html
   ```
4. Zip the folder and upload
5. The system validates the structure and adds it to the dashboard

## Admin Features

Admins have access to:
- View all ideas (including pending approval)
- Delete any idea
- Approve/reject uploaded ideas
- Toggle approval requirement setting

## Themes

Switch between 6 beautiful themes:
- **Light**: Clean and bright default theme
- **Dark**: Easy on the eyes for night work
- **Ocean**: Calming blue tones
- **Sunset**: Warm orange and amber
- **Forest**: Natural green shades
- **Purple Haze**: Creative purple palette

## License

MIT
