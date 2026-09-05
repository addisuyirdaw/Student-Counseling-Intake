import rateLimit from 'express-rate-limit';

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 failed requests per windowMs
  skipSuccessfulRequests: true, // Do not count successful logins
  standardHeaders: true, // Draft-6 / Draft-7 RateLimit-* headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
  statusCode: 429,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many failed login attempts. Please try again in 15 minutes.',
    });
  },
});
