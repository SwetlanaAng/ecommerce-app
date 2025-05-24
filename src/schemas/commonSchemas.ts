import { z } from 'zod';
import { getAge } from '../shared/utils/getAge';

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
export const firstNameSchema = z
  .string()
  .nonempty({ message: 'First name must contain at least one character' })
  .refine(
    value =>
      /[a-zA-Z]/.test(value) &&
      !/\d/.test(value) &&
      !/[@!#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value),
    {
      message: 'First name must contain only Latin characters and no special characters or numbers',
    }
  );
export const lastNameSchema = z
  .string()
  .nonempty({ message: 'Last name must contain at least one character' })
  .refine(
    value =>
      /[a-zA-Z]/.test(value) &&
      !/\d/.test(value) &&
      !/[@!#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value),
    {
      message: 'Last name must contain only Latin characters and no special characters or numbers',
    }
  );
export const dateOfBirthSchema = z
  .string()
  .refine(val => !isNaN(Date.parse(val)), {
    message: 'Please, enter a valid date of birth',
  })
  .refine(val => getAge(new Date(val)) >= 18, {
    message: 'You must be at least 18 years old',
  });
export const citySchema = z
  .string()
  .nonempty({ message: 'City must contain at least one character' })
  .refine(
    value =>
      /[a-zA-Z]/.test(value) &&
      !/\d/.test(value) &&
      !/[@!#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value),
    {
      message: 'City must contain only Latin characters and no special characters or numbers',
    }
  );
export const streetSchema = z
  .string()
  .nonempty({ message: 'Street must contain at least one character' })
  .refine(value => /^[a-zA-Z0-9\s.,'-]+$/.test(value), {
    message: 'Street must contain only Latin characters, numbers, and spaces',
  });
export const postalCodeSchema = z
  .string()
  .nonempty({ message: 'Postal code is required' })
  .refine(value => /^\d{5}$/.test(value), {
    message: 'Postal code must be 5 digits',
  });
