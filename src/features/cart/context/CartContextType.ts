import { createContext } from 'react';
import { Cart } from '../../../types/interfaces';

export interface CartContextType {
  cart: Cart | null;
  cartItemsCount: number;
  isLoading: boolean;
  error: string | null;
  addToCart: (productId: string) => Promise<void>;
  addProductToCart: (productDetails: {
    productId: string;
    name: string;
    price: number;
    imageUrl: string;
    variant?: {
      id: number;
      attributes: Array<{ name: string; value: unknown }>;
    };
  }) => Promise<void>;
  removeFromCart: (lineItemId: string) => Promise<void>;
  updateCartItemQuantity: (lineItemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  setCart: (cart: Cart) => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);
