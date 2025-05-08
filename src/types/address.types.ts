export interface Address {
  country: string;
  city: string;
  street: string;
  postalCode: string;
  isDefault: boolean;
}

export interface AddressData {
  billingAddress: Address;
  shippingAddress: Address;
}

export const initialAddress: Address = {
  country: 'Spain',
  city: '',
  street: '',
  postalCode: '',
  isDefault: false,
};
