import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid university email address'),
  password: z.string().min(1, 'Password / Passcode is required'),
});
