import { z } from 'zod';
import { streetSchema, citySchema, postalCodeSchema } from './commonSchemas';

export const EditAddressSchema = z.object({
  billing_city: citySchema,
  billing_street: streetSchema,
  billing_postalCode: postalCodeSchema,
  billing_isDefault: z.boolean(),
  shipping_city: citySchema,
  shipping_street: streetSchema,
  shipping_postalCode: postalCodeSchema,
  shipping_isDefault: z.boolean(),
});

export type EditAddressModal = z.infer<typeof EditAddressSchema>;
