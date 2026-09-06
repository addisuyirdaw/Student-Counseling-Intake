import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'advisor-counseling-secure-jwt-secret-key-2024';

/**
 * Verifies the advisor JWT from HttpOnly cookie or Authorization header.
 * Attaches decoded payload to req.advisor on success.
 */
export function authenticateAdvisor(req, res, next) {
  const tokenFromCookie = req.cookies?.advisor_token;
  const authHeader = req.headers.authorization;
  const tokenFromHeader = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

  const token = tokenFromCookie || tokenFromHeader;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No active advisor session found' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.advisor = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired advisor session' });
  }
}

/**
 * Requires the authenticated advisor to have the ADMIN role.
 * Must be used AFTER authenticateAdvisor in the middleware chain.
 */
export function requireAdmin(req, res, next) {
  if (!req.advisor) {
    return res.status(401).json({ error: 'Unauthorized: No active advisor session found' });
  }
  if (req.advisor.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden: Admin role required for this action' });
  }
  next();
}
