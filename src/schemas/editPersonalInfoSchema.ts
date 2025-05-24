import { z } from 'zod';
import { dateOfBirthSchema, emailSchema, firstNameSchema, lastNameSchema } from './commonSchemas';

export const editPersonalInfoSchema = z.object({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  email: emailSchema,
  dateOfBirth: dateOfBirthSchema,
});

export type editPersonalInfoModal = z.infer<typeof editPersonalInfoSchema>;
