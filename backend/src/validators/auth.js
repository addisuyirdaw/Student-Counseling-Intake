import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid university email address'),
  password: z.string().min(1, 'Password / Passcode is required'),
});

export const createStaffSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().email('Please enter a valid email address'),
  role: z.enum(['ADMIN', 'LEAD_ADVISOR', 'COUNSELOR'], {
    errorMap: () => ({ message: 'Role must be one of: ADMIN, LEAD_ADVISOR, COUNSELOR' }),
  }),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password must not exceed 128 characters'),
});

export const updateSelfSchema = z
  .object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').optional(),
    email: z.string().trim().email('Please enter a valid email address').optional(),
    currentPassword: z.string().min(1, 'Current password is required to change password').optional(),
    newPassword: z
      .string()
      .min(6, 'New password must be at least 6 characters')
      .max(128, 'New password must not exceed 128 characters')
      .optional(),
  })
  .refine(
    (data) => {
      if (data.newPassword && !data.currentPassword) {
        return false;
      }
      return true;
    },
    {
      message: 'Current password is required to set a new password',
      path: ['currentPassword'],
    }
  );

export const updateStaffAdminSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().trim().email('Please enter a valid email address').optional(),
  role: z.enum(['ADMIN', 'LEAD_ADVISOR', 'COUNSELOR']).optional(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password must not exceed 128 characters')
    .optional(),
  isActive: z.boolean().optional(),
});
