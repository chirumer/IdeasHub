# Ideas Hub - Full Stack Application

## 🎉 New Architecture: Backend + Frontend

The application has been restructured into a full-stack architecture with:
- **Backend**: Express.js server with file system storage
- **Frontend**: React + Vite application
- **API**: REST API for authentication and idea management

## 📁 Project Structure

```
Hack Ideas/
├── backend/                  # Backend server
│   ├── src/
│   │   ├── server.ts        # Main Express server
│   │   ├── routes/
│   │   │   ├── auth.ts      # Authentication endpoints
│   │   │   └── ideas.ts     # Ideas management endpoints
│   │   ├── types.ts         # TypeScript types
│   │   └── init-ideas.ts    # Initialize default ideas
│   ├── project_ideas/       # File system storage for ideas
│   ├── package.json
│   └── tsconfig.json
├── frontend/                # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts (Auth, Theme)
│   │   ├── lib/
│   │   │   └── api.ts       # API client
│   │   ├── pages/           # Page components
│   │   └── types/           # TypeScript types
│   ├── package.json
│   └── vite.config.ts
├── package.json             # Root package for running both servers
├── start.sh                 # Bash script to start both servers
└── README-FULLSTACK.md      # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

```bash
# Install all dependencies (root + frontend + backend)
npm run install:all

# Or install manually:
npm install                    # Root dependencies
cd frontend && npm install     # Frontend dependencies
cd ../backend && npm install   # Backend dependencies
```

### Running the Application

**Option 1: Using npm script (recommended)**
```bash
npm run dev
```

**Option 2: Using bash script**
```bash
./start.sh
```

**Option 3: Run servers separately**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **API Health Check**: http://localhost:3001/api/health

## 🔐 Authentication

### Login Credentials

**Admin Account:**
- Username: `admin`
- Password: `chiru`
- Access: Full access including admin features

**Standard Account:**
- Username: `hacker`  
- Password: `pragmanchiru`
- Access: Standard user (can upload ideas, view approved ideas)

### How Authentication Works

1. Frontend sends credentials to `/api/auth/login`
2. Backend validates and creates a session
3. Session cookie is stored in the browser
4. All subsequent requests include the session cookie
5. Backend validates session for protected endpoints

## 📚 API Endpoints

### Authentication
- `POST /api/auth/login` - Login with username/password
- `POST /api/auth/logout` - Logout and destroy session
- `GET /api/auth/me` - Get current logged-in user

### Ideas
- `GET /api/ideas` - Get all ideas (filtered by user role)
- `GET /api/ideas/:id` - Get single idea by ID
- `POST /api/ideas/upload` - Upload new idea (requires auth)
- `PATCH /api/ideas/:id` - Update idea approval (admin only)
- `DELETE /api/ideas/:id` - Delete idea (admin only)

### Settings
- `GET /api/ideas/settings/app` - Get app settings
- `PUT /api/ideas/settings/app` - Update settings (admin only)

## 💾 Data Storage

### File System Structure

Ideas are stored in the file system at `backend/project_ideas/`:

```
backend/project_ideas/
├── educational-reels-generator/
│   ├── metadata.json
│   └── pages/
│       ├── hackathon-pitch.html
│       └── implementation.html
├── smart-campus-navigator/
│   ├── metadata.json
│   └── pages/
│       └── overview.html
└── ecotrack-carbon-footprint-tracker/
    ├── metadata.json
    └── pages/
        └── overview.html
```

### metadata.json Format

```json
{
  "name": "Educational Reels Generator",
  "author": "admin",
  "approved": true,
  "createdAt": "2025-11-11T00:00:00.000Z"
}
```

### Benefits of File System Storage

1. **Persistence**: Data survives browser refreshes and server restarts
2. **Portability**: Easy to backup, version control, and share
3. **Transparency**: Can inspect and edit files directly
4. **Scalability**: Can migrate to database later without changing API

## 🎨 Frontend Updates

### New API Client

Located at `frontend/src/lib/api.ts`, provides functions for:
- `authAPI.login()`, `authAPI.logout()`, `authAPI.getCurrentUser()`
- `ideasAPI.getAll()`, `ideasAPI.getById()`, `ideasAPI.upload()`
- `settingsAPI.get()`, `settingsAPI.update()`

### Updated Components

All components now use API calls instead of localStorage:
- **AuthContext**: Uses `/api/auth/*` endpoints
- **DashboardPage**: Fetches ideas from `/api/ideas`
- **IdeaViewerPage**: Fetches single idea from `/api/ideas/:id`
- **UploadModal**: Posts to `/api/ideas/upload`
- **AdminSettingsModal**: Uses `/api/ideas` and `/api/ideas/settings/app`

## 🛠️ Development

### Backend Development

```bash
cd backend
npm run dev          # Start with hot reload
npm run build        # Build TypeScript
npm start            # Run compiled code
```

### Frontend Development

```bash
cd frontend
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Environment Variables

Backend supports these environment variables:
```bash
PORT=3001                    # Backend server port (default: 3001)
SESSION_SECRET=your-secret   # Session secret (default: hardcoded)
```

## 📤 Uploading New Ideas

### Via UI
1. Login to the application
2. Click "Upload" in the navigation bar
3. Download the context file (optional, for structure reference)
4. Create your idea following the structure
5. Zip the folder and upload
6. Wait for validation and confirmation

### Manually (File System)
1. Create a folder in `backend/project_ideas/`
2. Create `metadata.json` with required fields
3. Create `pages/` directory with HTML files
4. Restart backend or wait for hot reload

## 🔒 Security Features

- Session-based authentication with HTTP-only cookies
- CORS configured for localhost development
- Admin-only routes protected with middleware
- Input validation on all endpoints
- Strict zip file validation for uploads

## 🧪 Testing

The application can be tested with the existing Selenium test suite:

```bash
python3 test_app.py
```

Note: Update the test script if needed to handle API loading states.

## 🚢 Deployment

### Backend Deployment

1. Build the backend:
   ```bash
   cd backend
   npm run build
   ```

2. Deploy the `backend/dist` folder and `backend/project_ideas` to your server

3. Set environment variables:
   ```bash
   PORT=3001
   SESSION_SECRET=your-secure-secret-here
   ```

4. Start the server:
   ```bash
   npm start
   ```

### Frontend Deployment

1. Update API URL in `frontend/src/lib/api.ts`:
   ```typescript
   const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3001/api';
   ```

2. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

3. Deploy the `frontend/dist` folder to static hosting (Vercel, Netlify, etc.)

## 🔄 Migration from Old Architecture

### What Changed

**Before:**
- Single folder structure
- LocalStorage for data persistence
- Hardcoded authentication in frontend
- No API layer

**After:**
- Separate frontend/backend folders
- File system for data persistence
- Backend authentication with sessions
- RESTful API layer

### Data Migration

Old localStorage data will not automatically transfer. If you have important data:

1. Export from browser localStorage
2. Convert to file system format
3. Place in `backend/project_ideas/`

## 📝 Scripts Reference

### Root Package Scripts
- `npm run dev` - Start both frontend and backend
- `npm run dev:backend` - Start only backend
- `npm run dev:frontend` - Start only frontend
- `npm run install:all` - Install all dependencies
- `npm run build` - Build both frontend and backend
- `npm start` - Run start.sh script

### Helpful Commands
```bash
# Check if servers are running
curl http://localhost:3001/api/health
curl http://localhost:5173

# Kill all related processes
pkill -f "tsx|vite|concurrently"

# View backend logs
cd backend && npm run dev

# View frontend logs
cd frontend && npm run dev
```

## 🎓 Learning Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)

## 💡 Tips

1. **Use concurrently**: The root `npm run dev` uses concurrently to run both servers
2. **Hot Reload**: Both frontend and backend support hot reload in development
3. **API Testing**: Use tools like Postman or curl to test API endpoints
4. **Debug Mode**: Check browser DevTools Network tab for API calls
5. **Logs**: Check both terminal windows for backend and frontend logs

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill processes on specific ports
lsof -ti:3001 | xargs kill -9  # Backend
lsof -ti:5173 | xargs kill -9  # Frontend
```

### CORS Errors
- Ensure backend is running on port 3001
- Check `cors` configuration in `backend/src/server.ts`
- Verify frontend is accessing `http://localhost:3001`

### Session Not Persisting
- Check browser allows cookies
- Verify `credentials: 'include'` in API calls
- Ensure session secret is configured

### Ideas Not Loading
- Check backend is running
- Verify `backend/project_ideas/` directory exists
- Check browser console for errors
- Test API endpoint directly: `curl http://localhost:3001/api/ideas`

## 🎉 Enjoy Your Full-Stack Application!

The application is now running with a proper backend server and file system storage. All features from the original application are preserved and enhanced with better data persistence and API architecture.

**Happy Hacking! 🚀**
