export interface Customer {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  version?: number;
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
    obj?: {
      name: {
        'en-US': string;
      };
    };
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
        | boolean
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
    'en-US': string;
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
  taxCategory?: {
    typeId: string;
    id: string;
  };
  priceMode: string;
  createdAt: string;
  lastModifiedAt: string;
}

export interface ProductCardProps {
  id?: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  isOnSale?: boolean;
  imageUrl: string;
  slug: string;
  filters?: {
    isBestSeller?: boolean;
    isGlutenFree?: boolean;
  };
  category: string;
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
  isGlutenFree?: boolean;
  categoryId?: string;
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
  version: number;
}

export interface ProfileAddressData {
  country: string;
  city: string;
  streetName: string;
  id: string;
  postalCode: string;
}

export interface PersonalInfo {
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

export interface CategoryWithChildren extends CategoryData {
  children: CategoryWithChildren[];
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  isOnSale?: boolean;
  quantity: number;
  imageUrl: string;
  variant: {
    id: number;
    attributes: Array<{
      name: string;
      value: unknown;
    }>;
  };
  appliedDiscounts?: Array<{
    discountType: 'product' | 'cart';
    discountAmount: number;
    discountId?: string;
  }>;
}

export interface Cart {
  id: string;
  version: number;
  lineItems: CartItem[];
  totalPrice: {
    centAmount: number;
    fractionDigits: number;
    currencyCode: string;
  };
  discountCodes?: Array<{
    discountCode: {
      id: string;
      typeId: string;
    };
  }>;
  discountOnTotalPrice?: {
    discountedAmount: {
      centAmount: number;
      fractionDigits: number;
      currencyCode: string;
    };
    includedDiscounts: Array<{
      discount: {
        id: string;
        typeId: string;
      };
      discountedAmount: {
        centAmount: number;
        fractionDigits: number;
        currencyCode: string;
      };
    }>;
  };
}

export interface DiscountCode {
  id: string;
  version: number;
  code: string;
  name: { [key: string]: string };
  description: { [key: string]: string };
  cartDiscounts: Array<{
    typeId: string;
    id: string;
  }>;
  isActive: boolean;
  validUntil: string;
}

export interface CartDiscount {
  id: string;
  version: number;
  value: {
    type: string;
    permyriad: number;
  };
  target: {
    type: string;
    predicate: string;
  };
  name: { [key: string]: string };
  description: { [key: string]: string };
  isActive: boolean;
  requiresDiscountCode: boolean;
}

export interface CommercetoolsProduct {
  id: string;
  version: number;
  key: string;
  productType: {
    id: string;
  };
  masterData: {
    current: {
      name: { 'en-US': string };
      description?: { 'en-US': string };
      slug: { 'en-US': string };
      categories: Array<{
        typeId: string;
        id: string;
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
            | boolean
            | {
                key: string;
                label: string;
              };
        }>;
      };
      searchKeywords: unknown;
    };
    hasStagedChanges: boolean;
    published: boolean;
  };
  taxCategory?: {
    typeId: string;
    id: string;
  };
  createdAt: string;
  lastModifiedAt: string;
}

export interface CommercetoolsCategory {
  id: string;
  name: { 'en-US': string };
  parent?: {
    id: string;
  };
}
