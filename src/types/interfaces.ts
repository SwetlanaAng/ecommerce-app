export interface Customer {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
}

export interface ResultProps {
  isSuccess: boolean;
  message: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  user_id?: string;
}

export interface AddressData {
  country: string;
  city: string;
  street: string;
  postalCode: string;
  isDefault?: boolean;
}

export interface RegistrationData {
  email: string;
  password: string;
  firstName: string;
  secondName: string;
  date?: string;
  billingAddress: AddressData;
  shippingAddress: AddressData;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}
