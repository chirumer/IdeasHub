# Hackathon Ideas Hub - Complete Usage Guide

## 🚀 Quick Start

The application is currently running at: **http://localhost:5173**

### Login Credentials

**Admin Account** (Full access):
- Username: `admin`
- Password: `chiru`

**Hacker Account** (Standard user):
- Username: `hacker`
- Password: `pragmanchiru`

## 📋 Features Overview

### 1. Authentication System
- ✅ Persistent login (stays logged in after closing browser)
- ✅ Role-based access (Admin vs Hacker)
- ✅ Clean, modern login page with gradient background

### 2. Dashboard
- **View all hackathon ideas** in a beautiful card layout
- **Search functionality** - Search by idea name or author
- **Click any card** to view the full idea
- **Responsive design** - Works on desktop, tablet, and mobile

### 3. Idea Viewer
- **Multi-page navigation** - Switch between different pages of an idea
- **Back to Dashboard** button for easy navigation
- **Beautiful typography** with custom prose styling
- **Author and date information** displayed prominently

### 4. Theme System
Six beautiful themes to choose from:
- 🌟 **Light** - Clean and bright default theme
- 🌙 **Dark** - Easy on the eyes for night work
- 🌊 **Ocean** - Calming blue tones
- 🌅 **Sunset** - Warm orange and amber
- 🌲 **Forest** - Natural green shades
- 💜 **Purple Haze** - Creative purple palette

**How to switch themes:**
1. Click the palette icon (🎨) in the top navigation bar
2. Select your preferred theme from the dropdown
3. The theme persists across sessions

### 5. Navigation Features

#### Browse Ideas Dropdown
- Click "Browse Ideas" in the navbar
- See all available ideas with search
- Click any idea to navigate directly to it

#### AI Chat Assistant
- Click "AI Chat" in the navbar
- Type messages to interact with the AI
- Currently a placeholder that responds with "Hello!"
- Modal interface with smooth animations

#### Upload Modal
- Click "Upload" in the navbar
- **Step 1:** Download the context file (explains structure requirements)
- **Step 2:** Upload your zip file
- System validates the structure strictly
- Success/error feedback with detailed messages

### 6. Admin Features (Admin account only)

#### Admin Settings Modal
Access by clicking "Admin" in the navbar:

**Application Settings:**
- Toggle "Require Admin Approval" for new uploads
- When ON: Hacker-uploaded ideas need admin approval
- When OFF: Ideas appear immediately after upload

**Manage Ideas:**
- View all ideas with author and page count
- **Approve/Unapprove** ideas (checkmark/X icons)
- **Delete** ideas (trash icon)
- Visual feedback for all actions

### 7. User Menu
- Click your username in the top right
- View your role (admin/hacker)
- Logout option

## 📤 Uploading New Ideas

### Structure Requirements

Your zip file must contain:
```
your-idea-name/
├── metadata.json
└── pages/
    ├── page1.html
    ├── page2.html
    └── ...
```

### metadata.json Format
```json
{
  "name": "Your Hackathon Idea Name",
  "author": "your-username"
}
```

### HTML Page Format
- Include ONLY content (no `<html>`, `<head>`, or `<body>` tags)
- First `<h1>` tag becomes the page title
- Use standard HTML tags: `<h1>`, `<h2>`, `<h3>`, `<p>`, `<ul>`, `<li>`, `<strong>`, etc.

### Example
A test idea is included: `test-idea.zip`

**To test the upload:**
1. Login as admin or hacker
2. Click "Upload" in the navbar
3. Download the context file (optional, for reference)
4. Click "Select Zip File" and choose `test-idea.zip`
5. Wait for validation and upload
6. Check the dashboard for your new idea!

## 🎨 Pre-loaded Ideas

The application comes with 3 example ideas:

1. **Educational Reels Generator** (by admin)
   - YouTube content clipping with AI filtering
   - 2 pages: Hackathon Pitch, Implementation

2. **Smart Campus Navigator** (by placeholder)
   - AR-powered campus navigation
   - 1 page: Overview

3. **EcoTrack - Carbon Footprint Tracker** (by placeholder)
   - Personal carbon footprint tracking app
   - 1 page: Overview

## 🔧 Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run automated tests
python3 test_app.py
```

## 📱 Responsive Design

The application is fully responsive:
- **Desktop (2560x1600):** Full feature set with spacious layout
- **Tablet:** Adapted layout with maintained functionality
- **Mobile (375x812):** Mobile-optimized interface with hamburger menu

## 🎯 Testing Checklist

### As Admin:
- ✅ Login with admin credentials
- ✅ View all ideas on dashboard
- ✅ Search for specific ideas
- ✅ Click and view an idea with multiple pages
- ✅ Switch between pages in an idea
- ✅ Test all 6 themes
- ✅ Browse ideas from dropdown
- ✅ Chat with AI assistant
- ✅ Upload a new idea (test-idea.zip)
- ✅ Open admin settings
- ✅ Toggle approval requirement
- ✅ Approve/unapprove ideas
- ✅ Delete an idea
- ✅ Logout

### As Hacker:
- ✅ Login with hacker credentials
- ✅ View approved ideas only
- ✅ Upload an idea
- ✅ See upload requires approval (if admin enabled it)
- ✅ All other features work the same

## 🐛 Troubleshooting

### Issue: Can't see uploaded idea
- **Solution:** Check if you're logged in as hacker and admin approval is required
- **Solution:** Check admin settings to approve the idea

### Issue: Themes not changing
- **Solution:** Clear browser cache and reload
- **Solution:** Check browser console for errors

### Issue: Upload fails
- **Solution:** Verify your zip structure matches the requirements exactly
- **Solution:** Check that metadata.json is valid JSON
- **Solution:** Ensure all HTML files have at least one `<h1>` tag

### Issue: Dev server won't start
- **Solution:** Check if port 5173 is already in use
- **Solution:** Run `npm install` to ensure all dependencies are installed

## 🎓 Tips for Best Experience

1. **Use Chrome or Edge** for the best experience (Selenium tests use Chrome)
2. **Enable JavaScript** - Required for the app to function
3. **Start with the Light theme** to see the default design
4. **Try different themes** to find your favorite
5. **Upload test-idea.zip** to see how the upload system works
6. **Test as both admin and hacker** to see different permission levels

## 📊 Project Statistics

- **Total Files:** 40+
- **Lines of Code:** ~3,500+
- **Components:** 15+
- **Pages:** 3 (Login, Dashboard, Idea Viewer)
- **Themes:** 6
- **Default Ideas:** 3
- **Test Coverage:** Automated Selenium tests included

## 🎉 Enjoy Your Hackathon Ideas Hub!

The application is fully functional and ready to use. Feel free to:
- Add your own hackathon ideas
- Customize the themes
- Invite team members (by sharing credentials)
- Build upon this foundation for your own projects

**Happy Hacking! 🚀**
