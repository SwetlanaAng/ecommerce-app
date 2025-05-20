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
  version: number;
  productType: {
    typeId: string;
    id: string;
  };
  name: {
    'en-US': string;
  };
  description?: {
    'en-US': string;
  };
  categories: Array<{
    id: string;
    typeId: string;
  }>;
  masterVariant: {
    id: number;
    prices: Array<{
      id: string;
      value: {
        type: string;
        currencyCode: string;
        centAmount: number;
        fractionDigits: number;
      };
      discounted?: {
        value: {
          type: string;
          currencyCode: string;
          centAmount: number;
          fractionDigits: number;
        };
      };
    }>;
    images: Array<{
      url: string;
      dimensions: {
        w: number;
        h: number;
      };
    }>;
    attributes: Array<{
      name: string;
      value:
        | string
        | {
            key: string;
            label: string;
          };
    }>;
  };
  searchKeywords?: {
    en: Array<{
      text: string;
    }>;
  };
  slug: {
    en: string;
  };
  metaTitle?: {
    en: string;
  };
  metaDescription?: {
    en: string;
  };
  hasStagedChanges: boolean;
  published: boolean;
  key: string;
  taxCategory: {
    typeId: string;
    id: string;
  };
  priceMode: string;
  createdAt: string;
  lastModifiedAt: string;
}

export interface ProductCardProps {
  id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  isOnSale?: boolean;
  imageUrl: string;
  category?: string;
}

export interface CategoryData {
  id: string;
  name: {
    'en-US': string;
  };
  parent?: {
    id: string;
  };
}

export interface ProductFilters {
  flavors?: string[];
  priceRange?: {
    min?: number;
    max?: number;
  };
  isBestSeller?: boolean;
}

export interface CustomerInfo {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  addresses: ProfileAddressData[];
  shippingAddressIds: string[];
  billingAddressIds: string[];
  dateOfBirth: string;
  defaultBillingAddressId?: string;
  defaultShippingAddressId?: string;
}

export interface ProfileAddressData {
  country: string;
  city: string;
  streetName: string;
  id: string;
  postalCode: string;
}
