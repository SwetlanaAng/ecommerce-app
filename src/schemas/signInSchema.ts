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
    .refine(val => !isNaN(Date.parse(val)), {
      message: 'Please, enter a valid date of birth',
    })
    .refine(val => getAge(new Date(val)) >= 18, {
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
    .refine(value => /^\d{5}$/.test(value), {
      message: 'Postal code must be 5 digits',
    }),

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
    .refine(value => /^\d{5}$/.test(value), {
      message: 'Postal code must be 5 digits',
    }),

  shipping_isDefault: z.boolean(),
});

export type FormFields = z.infer<typeof formSchema>;
