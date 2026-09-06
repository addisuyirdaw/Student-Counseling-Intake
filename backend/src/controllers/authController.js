import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'advisor-counseling-secure-jwt-secret-key-2024';

export async function login(req, res) {
  const { email, password } = req.body;

  // Case-insensitive email lookup — never expose whether email exists
  const normalizedEmail = (email || '').trim().toLowerCase();

  let advisor;
  try {
    advisor = await prisma.advisor.findFirst({
      where: { email: normalizedEmail, isActive: true },
    });
  } catch (err) {
    console.error('DB lookup error during login:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }

  // Constant-time comparison even when advisor not found (prevents timing attacks)
  const dummyHash = '$2a$12$dummyhashfortimingprotectionXXXXXXXXXXXXXXXXXXXXXXX';
  const hashToCompare = advisor?.passwordHash ?? dummyHash;
  const passwordMatch = await bcrypt.compare(password, hashToCompare);

  if (!advisor || !passwordMatch) {
    // Generic sanitized error message to prevent user enumeration
    return res.status(401).json({ error: 'Invalid email or staff passcode' });
  }

  const tokenPayload = {
    id: advisor.id,
    name: advisor.name,
    email: advisor.email,
    role: advisor.role,
  };

  const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '24h' });

  const isProduction = process.env.NODE_ENV === 'production';

  // HttpOnly cookie — SameSite=None in prod to allow cross-origin cookies (Vercel)
  res.cookie('advisor_token', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    path: '/',
  });

  return res.status(200).json({
    message: 'Authentication successful',
    token,
    user: {
      name: advisor.name,
      email: advisor.email,
      role: advisor.role,
    },
  });
}

export function getMe(req, res) {
  if (!req.advisor) {
    return res.status(401).json({ error: 'Unauthorized: No active advisor session found' });
  }

  return res.status(200).json({
    user: {
      name: req.advisor.name,
      email: req.advisor.email,
      role: req.advisor.role,
    },
  });
}

export function logout(req, res) {
  const isProduction = process.env.NODE_ENV === 'production';
  res.clearCookie('advisor_token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
  });

  return res.status(200).json({ message: 'Logged out successfully' });
}
