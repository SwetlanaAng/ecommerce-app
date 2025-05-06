import { z } from 'zod';
export const formSchema = z.object({
  email: z.string().email('Incorrect email'),
  password: z.string().min(6, 'Too short'),
  firstName: z
    .string()
    .min(2, { message: 'Too short' })
    .max(20, 'Too long')
    .transform(v => v.toLowerCase().replace(/\s+/g, '_')),
  lastName: z
    .string()
    .min(2, { message: 'Too short' })
    .max(20, 'Too long')
    .transform(v => v.toLowerCase().replace(/\s+/g, '_')),
  dateOfBirth: z.string(),
  billing_city: z.string(),
  billing_street: z.string(),
  billing_postalCode: z.string(),
  billing_isDefault: z.boolean(),
  sameAsShipping: z.boolean(),
  shipping_city: z.string(),
  shipping_street: z.string(),
  shipping_postalCode: z.string(),
  shipping_isDefault: z.boolean(),
});
