import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const SALT_ROUNDS = 12;

const VALID_ROLES = ['ADMIN', 'LEAD_ADVISOR', 'COUNSELOR'];

/**
 * POST /api/v1/auth/staff/create
 * Admin-only: Register a new advisor/staff member.
 * Body: { name, email, role, password }
 */
export async function createStaff(req, res) {
  const { name, email, role, password } = req.body;

  if (!name?.trim() || !email?.trim() || !password?.trim() || !role?.trim()) {
    return res.status(400).json({ error: 'name, email, role, and password are all required' });
  }

  if (!VALID_ROLES.includes(role)) {
    return res.status(400).json({
      error: `Invalid role. Must be one of: ${VALID_ROLES.join(', ')}`,
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Check for existing advisor with that email
  const existing = await prisma.advisor.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    return res.status(409).json({ error: 'An advisor with this email already exists' });
  }

  let passwordHash;
  try {
    passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  } catch (err) {
    console.error('Password hashing error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }

  let advisor;
  try {
    advisor = await prisma.advisor.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        role,
        passwordHash,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  } catch (err) {
    console.error('DB error creating staff:', err);
    return res.status(500).json({ error: 'Failed to create advisor account' });
  }

  return res.status(201).json({
    message: 'Advisor account created successfully',
    advisor,
  });
}

/**
 * GET /api/v1/auth/staff
 * Admin-only: List all advisor accounts (never exposes passwordHash).
 */
export async function listStaff(req, res) {
  try {
    const advisors = await prisma.advisor.findMany({
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return res.status(200).json({ advisors });
  } catch (err) {
    console.error('DB error listing staff:', err);
    return res.status(500).json({ error: 'Failed to retrieve staff list' });
  }
}

/**
 * PATCH /api/v1/auth/staff/:id/deactivate
 * Admin-only: Soft-delete / deactivate an advisor account.
 */
export async function deactivateStaff(req, res) {
  const { id } = req.params;

  // Prevent admin from deactivating their own account
  if (id === req.advisor.id) {
    return res.status(400).json({ error: 'You cannot deactivate your own account' });
  }

  try {
    const updated = await prisma.advisor.update({
      where: { id },
      data: { isActive: false },
      select: { id: true, name: true, email: true, isActive: true },
    });
    return res.status(200).json({ message: 'Advisor deactivated', advisor: updated });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Advisor not found' });
    }
    console.error('DB error deactivating staff:', err);
    return res.status(500).json({ error: 'Failed to deactivate advisor' });
  }
}
