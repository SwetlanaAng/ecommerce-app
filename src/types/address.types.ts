export interface Address {
  country: string;
  city: string;
  street: string;
  streetName?: string;
  postalCode: string;
  isDefault: boolean;
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
