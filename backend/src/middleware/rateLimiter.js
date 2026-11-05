import rateLimit from 'express-rate-limit';

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Relaxed limit to avoid locking out during setup and credential testing
  skipSuccessfulRequests: true, // Do not count successful logins
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: 429,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many failed login attempts. Please try again in a few moments.',
    });
  },
});
