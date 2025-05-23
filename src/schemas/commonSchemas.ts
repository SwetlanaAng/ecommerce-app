import { z } from 'zod';

export const emailSchema = z
  .string()
  .nonempty({ message: 'Email is required' })
  .refine((v: string) => v.trim() === v, {
    message: 'Email must not contain leading or trailing whitespace',
  })
  .refine((v: string) => v.includes('@'), {
    message: "Email must contain an '@' symbol",
  })
  .refine(
    (v: string) => {
      const parts = v.split('@');
      if (parts.length !== 2) return false;
      const domain = parts[1];
      return domain.includes('.') && domain.split('.').every(p => p.length > 0);
    },
    {
      message: 'Email must contain a valid domain name (e.g., example.com)',
    }
  )
  .refine((v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
    message: 'Email address must be properly formatted (e.g., user@example.com)',
  });

export const passwordSchema = z
  .string()
  .nonempty({ message: 'Password is required' })
  .min(8, { message: 'Password must contain at least 8 English letters' })
  .refine((v: string) => !v.includes(' '), {
    message: 'Password must not contain any spaces',
  })
  .refine((v: string) => /[A-Z]/.test(v), {
    message: 'Must contain at least one uppercase letter',
  })
  .refine((v: string) => /[a-z]/.test(v), {
    message: 'Must contain at least one lowercase letter',
  })
  .refine((v: string) => /\d/.test(v), {
    message: 'Must contain at least one digit',
  })
  .refine((v: string) => /[!@#$%^&*]/.test(v), {
    message: 'Must contain at least one special character (!@#$%^&*)',
  });
