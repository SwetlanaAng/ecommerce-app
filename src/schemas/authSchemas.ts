import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .nonempty({ message: 'Email is required' })
    .email({ message: 'Must be a valid email address' }),
  password: z
    .string()
    .nonempty({ message: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters' }),
});

export type LoginInput = z.infer<typeof loginSchema>;
