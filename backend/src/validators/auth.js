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
    .min(10, 'Password must be at least 10 characters')
    .max(128, 'Password must not exceed 128 characters'),
});
