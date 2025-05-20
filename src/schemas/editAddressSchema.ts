import { z } from 'zod';
import { streetSchema, citySchema, postalCodeSchema } from './commonSchemas';

export const EditAddressSchema = z.object({
  city: citySchema,
  street: streetSchema,
  postalCode: postalCodeSchema,
  isDefault: z.boolean(),
});

export type EditAddressModal = z.infer<typeof EditAddressSchema>;
