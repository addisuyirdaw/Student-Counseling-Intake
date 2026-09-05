import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'advisor-counseling-secure-jwt-secret-key-2024';

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
