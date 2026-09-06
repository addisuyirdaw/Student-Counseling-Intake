import express from 'express';
import { login, getMe, logout } from '../controllers/authController.js';
import { createStaff, listStaff, deactivateStaff } from '../controllers/staffController.js';
import { authenticateAdvisor, requireAdmin } from '../middleware/auth.js';
import { loginRateLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../middleware/validate.js';
import { loginSchema, createStaffSchema } from '../validators/auth.js';

const router = express.Router();

// ─── Public auth routes ────────────────────────────────────────────────────
router.post('/login', loginRateLimiter, validate(loginSchema), login);
router.post('/logout', logout);
router.get('/me', authenticateAdvisor, getMe);

// ─── Admin-only staff management routes ───────────────────────────────────
// POST   /api/v1/auth/staff/create      — Register a new advisor
// GET    /api/v1/auth/staff             — List all advisor accounts
// PATCH  /api/v1/auth/staff/:id/deactivate — Soft-deactivate an advisor
router.post(
  '/staff/create',
  authenticateAdvisor,
  requireAdmin,
  validate(createStaffSchema),
  createStaff
);
router.get('/staff', authenticateAdvisor, requireAdmin, listStaff);
router.patch('/staff/:id/deactivate', authenticateAdvisor, requireAdmin, deactivateStaff);

export default router;
