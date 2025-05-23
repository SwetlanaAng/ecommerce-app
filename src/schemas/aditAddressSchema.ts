import { z } from 'zod';
import { streetSchema, citySchema, postalCodeSchema } from './commonSchemas';

export const BillingAddressSchema = z.object({
  billing_city: citySchema,
  billing_street: streetSchema,
  billing_postalCode: postalCodeSchema,
  billing_isDefault: z.boolean(),
});

export const ShippingAddressSchema = z.object({
  shipping_city: citySchema,
  shipping_street: streetSchema,
  shipping_postalCode: postalCodeSchema,
  shipping_isDefault: z.boolean(),
});

export type BillingAddressModal = z.infer<typeof BillingAddressSchema>;
export type ShippingAddressModal = z.infer<typeof ShippingAddressSchema>;
export type EditAddressModal = BillingAddressModal | ShippingAddressModal;
