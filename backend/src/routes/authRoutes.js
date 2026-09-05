import express from 'express';
import { login, getMe, logout } from '../controllers/authController.js';
import { authenticateAdvisor } from '../middleware/auth.js';
import { loginRateLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../middleware/validate.js';
import { loginSchema } from '../validators/auth.js';

const router = express.Router();

router.post('/login', loginRateLimiter, validate(loginSchema), login);
router.get('/me', authenticateAdvisor, getMe);
router.post('/logout', logout);

export default router;
