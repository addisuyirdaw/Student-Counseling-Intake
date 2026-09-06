import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const SALT_ROUNDS = 12;
const JWT_SECRET = process.env.JWT_SECRET || 'advisor-counseling-secure-jwt-secret-key-2024';

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
        avatarUrl: true,
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
        avatarUrl: true,
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
 * PATCH /api/v1/auth/staff/me
 * Protected: Logged-in advisor updates their own name, email, password, or avatarUrl.
 * Body: { name?, email?, currentPassword?, newPassword?, avatarUrl? }
 */
export async function updateSelf(req, res) {
  const advisorId = req.advisor?.id;
  if (!advisorId) {
    return res.status(401).json({ error: 'Unauthorized: No advisor session' });
  }

  const { name, email, newPassword, avatarUrl } = req.body;

  try {
    const advisor = await prisma.advisor.findUnique({
      where: { id: advisorId },
    });

    if (!advisor || !advisor.isActive) {
      return res.status(404).json({ error: 'Advisor account not found or inactive' });
    }

    const updateData = {};

    // 1. Update Name
    if (name && name.trim() !== advisor.name) {
      updateData.name = name.trim();
    }

    // 2. Update Email (with collision check)
    if (email) {
      const normalizedEmail = email.trim().toLowerCase();
      if (normalizedEmail !== advisor.email) {
        const existingEmail = await prisma.advisor.findFirst({
          where: {
            email: normalizedEmail,
            NOT: { id: advisorId },
          },
        });
        if (existingEmail) {
          return res.status(409).json({ error: 'This email address is already in use by another advisor' });
        }
        updateData.email = normalizedEmail;
      }
    }

    // 3. Update Password — no current password check required
    if (newPassword) {
      updateData.passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    }

    // 4. Update Avatar Photo (URL, Base64 Data URI, or null/empty to clear)
    if (avatarUrl !== undefined) {
      const sanitizedAvatar = typeof avatarUrl === 'string' && avatarUrl.trim() ? avatarUrl.trim() : null;
      if (sanitizedAvatar !== advisor.avatarUrl) {
        updateData.avatarUrl = sanitizedAvatar;
      }
    }

    if (Object.keys(updateData).length === 0) {
      const token = jwt.sign(
        {
          id: advisor.id,
          name: advisor.name,
          email: advisor.email,
          role: advisor.role,
          avatarUrl: advisor.avatarUrl || null,
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      return res.status(200).json({
        message: 'No changes detected',
        token,
        user: {
          id: advisor.id,
          name: advisor.name,
          email: advisor.email,
          role: advisor.role,
          avatarUrl: advisor.avatarUrl || null,
        },
      });
    }

    const updated = await prisma.advisor.update({
      where: { id: advisorId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        isActive: true,
        updatedAt: true,
      },
    });

    // Generate refreshed JWT token reflecting updated profile and avatar
    const token = jwt.sign(
      {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        avatarUrl: updated.avatarUrl || null,
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('advisor_token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    });

    return res.status(200).json({
      message: 'Profile updated successfully',
      token,
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        avatarUrl: updated.avatarUrl || null,
      },
    });
  } catch (err) {
    console.error('Error updating advisor self profile:', err);
    return res.status(500).json({ error: 'Failed to update profile' });
  }
}

/**
 * PATCH /api/v1/auth/staff/:id
 * Admin-only: Update any advisor's details or reset their password.
 * Body: { name?, email?, role?, password?, isActive? }
 */
export async function updateStaffById(req, res) {
  const { id } = req.params;
  const { name, email, role, password, isActive } = req.body;

  try {
    const advisor = await prisma.advisor.findUnique({
      where: { id },
    });

    if (!advisor) {
      return res.status(404).json({ error: 'Advisor not found' });
    }

    const updateData = {};

    if (name && name.trim()) {
      updateData.name = name.trim();
    }

    if (email) {
      const normalizedEmail = email.trim().toLowerCase();
      if (normalizedEmail !== advisor.email) {
        const existing = await prisma.advisor.findFirst({
          where: {
            email: normalizedEmail,
            NOT: { id },
          },
        });
        if (existing) {
          return res.status(409).json({ error: 'This email is already assigned to another advisor' });
        }
        updateData.email = normalizedEmail;
      }
    }

    if (role) {
      if (!VALID_ROLES.includes(role)) {
        return res.status(400).json({ error: `Invalid role. Must be one of: ${VALID_ROLES.join(', ')}` });
      }
      updateData.role = role;
    }

    if (password && password.trim()) {
      updateData.passwordHash = await bcrypt.hash(password.trim(), SALT_ROUNDS);
    }

    if (typeof isActive === 'boolean') {
      // Prevent admin from deactivating themselves
      if (!isActive && id === req.advisor.id) {
        return res.status(400).json({ error: 'You cannot deactivate your own account' });
      }
      updateData.isActive = isActive;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(200).json({ message: 'No changes provided', advisor });
    }

    const updated = await prisma.advisor.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        isActive: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({
      message: 'Advisor updated successfully',
      advisor: updated,
    });
  } catch (err) {
    console.error('Error updating staff member by admin:', err);
    return res.status(500).json({ error: 'Failed to update advisor account' });
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
