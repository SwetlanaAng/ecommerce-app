export interface Address {
  country: string;
  city: string;
  street: string;
  streetName?: string;
  postalCode: string;
  isDefault: boolean;
}

export interface AddAddress {
  billing_country?: string;
  billing_city?: string;
  billing_street?: string;
  billing_postalCode?: string;
  billing_isDefault?: boolean;
  shipping_country?: string;
  shipping_city?: string;
  shipping_street?: string;
  shipping_postalCode?: string;
  shipping_isDefault?: boolean;
}

export interface AddressData {
  billingAddress: Address;
  shippingAddress: Address;
}

export const initialAddress: Address = {
  country: 'United States',
  city: '',
  street: '',
  postalCode: '',
  isDefault: false,
};
