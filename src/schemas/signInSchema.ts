import { z } from 'zod';
import {
  streetSchema,
  citySchema,
  dateOfBirthSchema,
  emailSchema,
  firstNameSchema,
  lastNameSchema,
  passwordSchema,
  postalCodeSchema,
} from './commonSchemas';

export const formSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  dateOfBirth: dateOfBirthSchema,
  billing_city: citySchema,
  billing_street: streetSchema,
  billing_postalCode: postalCodeSchema,
  billing_isDefault: z.boolean(),
  sameAsShipping: z.boolean(),
  shipping_city: citySchema,
  shipping_street: streetSchema,
  shipping_postalCode: postalCodeSchema,
  shipping_isDefault: z.boolean(),
});

export type FormFields = z.infer<typeof formSchema>;
