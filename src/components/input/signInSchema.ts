import { z } from 'zod';
export const formSchema = z.object({
  email: z
    .string()
    .nonempty({ message: 'Email is required' })
    .email({ message: 'Enter correct email (user@example.com)' }),
  password: z
    .string()
    .nonempty({ message: 'Password is required' })
    .min(8, { message: 'Password must contain at least 8 English letters' })
    .refine(value => /[A-Z]/.test(value) && /\d/.test(value) && /[a-z]/.test(value), {
      message:
        'Password must contain at least one letter in upper and lower case, and at least one number',
    }),
  firstName: z
    .string()
    .nonempty({ message: 'First name is required' })
    .refine(
      value =>
        /[a-zA-Z]/.test(value) && !/\d/.test(value) && !/(?=.*\d)[^!<>?=+@{}_$%]+$/.test(value),
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
        /[a-zA-Z]/.test(value) && !/\d/.test(value) && !/(?=.*\d)[^!<>?=+@{}_$%]+$/.test(value),
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
        /[a-zA-Z]/.test(value) && !/\d/.test(value) && !/(?=.*\d)[^!<>?=+@{}_$%]+$/.test(value),
      {
        message: 'City must contain at least one character and no special characters or numbers',
      }
    ),
  billing_street: z.string().nonempty({ message: 'Street is required' }),
  billing_postalCode: z
    .string()
    .length(5, { message: 'Postal code must follow the format for the country' })
    .refine(
      value =>
        /\d/.test(value) && /[a-zA-Z]/.test(value) && !/(?=.*\d)[^!<>?=+@{}_$%]+$/.test(value),
      {
        message: 'Postal code must follow the format for the country',
      }
    ),
  billing_isDefault: z.boolean(),
  sameAsShipping: z.boolean(),
  shipping_city: z
    .string()
    .nonempty({ message: 'City is required' })
    .refine(
      value =>
        /[a-zA-Z]/.test(value) && !/\d/.test(value) && !/(?=.*\d)[^!<>?=+@{}_$%]+$/.test(value),
      {
        message: 'City must contain at least one character and no special characters or numbers',
      }
    ),
  shipping_street: z.string().nonempty({ message: 'Street is required' }),
  shipping_postalCode: z
    .string()
    .length(5, { message: 'Postal code must follow the format for the country' })
    .refine(
      value =>
        /\d/.test(value) && /[a-zA-Z]/.test(value) && !/(?=.*\d)[^!<>?=+@{}_$%]+$/.test(value),
      {
        message: 'Postal code must follow the format for the country',
      }
    ),
  shipping_isDefault: z.boolean(),
});

function getAge(date: string): number {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dob = new Date(+date.split('-')[0], +date.split('-')[1], +date.split('-')[2]);
  const dobThisYear = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
  let age: number = 0;
  age = today.getFullYear() - dob.getFullYear();
  if (today < dobThisYear) {
    age = age - 1;
  }
  return age;
}
