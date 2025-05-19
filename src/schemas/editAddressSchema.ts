import { z } from 'zod';
import { streetSchema, citySchema, postalCodeSchema } from './commonSchemas';

export const editAddressSchema = z.object({
  city: citySchema,
  street: streetSchema,
  postalCode: postalCodeSchema,
  isDefault: z.boolean(),
});

export type editAddressModal = z.infer<typeof editAddressSchema>;
