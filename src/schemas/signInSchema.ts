import { z } from 'zod';
import { getAge } from '../shared/utils/functions';
import { emailSchema, passwordSchema } from './commonSchemas';

export const formSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: z
    .string()
    .nonempty({ message: 'First name is required' })
    .refine(
      value =>
        /[a-zA-Z]/.test(value) &&
        !/\d/.test(value) &&
        !/[@!#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value),
      {
        message:
          'First name must contain at least one character and no special characters or numbers',
      }
    ),
  lastName: z
    .string()
    .nonempty({ message: 'Last name is required' })
    .refine(
      value =>
        /[a-zA-Z]/.test(value) &&
        !/\d/.test(value) &&
        !/[@!#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value),
      {
        message:
          'Last name must contain at least one character and no special characters or numbers',
      }
    ),
  dateOfBirth: z
    .string()
    .date('Please, enter date of your birth')
    .refine(value => getAge(value) >= 18, {
      message: 'You must be at least 18 years old',
    }),
  billing_city: z
    .string()
    .nonempty({ message: 'City is required' })
    .refine(
      value =>
        /[a-zA-Z]/.test(value) &&
        !/\d/.test(value) &&
        !/[@!#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value),
      {
        message: 'City must contain at least one character and no special characters or numbers',
      }
    ),
  billing_street: z.string().nonempty({ message: 'Street is required' }),
  billing_postalCode: z
    .string()
    .nonempty({ message: 'Postal code is required' })
    .refine(
      value => {
        if (value.length === 0) return false;
        if (/^\d{5}$/.test(value)) return true;
        if (/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/.test(value.toUpperCase())) return true;
        return false;
      },
      {
        message: 'Postal code must be either 5 digits (US/Germany) or UK format (e.g., SW1A 1AA)',
      }
    ),
  billing_isDefault: z.boolean(),
  sameAsShipping: z.boolean(),
  shipping_city: z
    .string()
    .nonempty({ message: 'City is required' })
    .refine(
      value =>
        /[a-zA-Z]/.test(value) &&
        !/\d/.test(value) &&
        !/[@!#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value),
      {
        message: 'City must contain at least one character and no special characters or numbers',
      }
    ),
  shipping_street: z.string().nonempty({ message: 'Street is required' }),
  shipping_postalCode: z
    .string()
    .nonempty({ message: 'Postal code is required' })
    .refine(
      value => {
        if (value.length === 0) return false;
        if (/^\d{5}$/.test(value)) return true;
        if (/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/.test(value.toUpperCase())) return true;
        return false;
      },
      {
        message: 'Postal code must be either 5 digits (US/Germany) or UK format (e.g., SW1A 1AA)',
      }
    ),
  shipping_isDefault: z.boolean(),
});

export type FormFields = z.infer<typeof formSchema>;
