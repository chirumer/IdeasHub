import express from 'express';
import type { User } from '../types.js';

const router = express.Router();

// Hardcoded credentials (as per requirements)
const USERS = {
  admin: { username: 'admin', password: 'chiru', role: 'admin' as const },
  hacker: { username: 'hacker', password: 'pragmanchiru', role: 'hacker' as const }
};

// Login endpoint
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Find matching user
  const user = Object.values(USERS).find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Set session
  req.session.user = {
    username: user.username,
    role: user.role
  };

  res.json({
    user: {
      username: user.username,
      role: user.role
    }
  });
});

// Logout endpoint
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to logout' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

// Get current user
router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  res.json({ user: req.session.user });
});

// Middleware to check if user is authenticated
export const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// Middleware to check if user is admin
export const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  if (req.session.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

export default router;
