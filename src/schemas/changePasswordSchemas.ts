import { z } from 'zod';
import { passwordSchema } from './commonSchemas';

export const changePasswordSchema = z.object({
  currentPassword: passwordSchema,
  newPassword: passwordSchema,
});

export type ChangePasswordModal = z.infer<typeof changePasswordSchema>;
