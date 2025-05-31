import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Cart, CartItem } from '../../../types/interfaces';
import { useAuth } from '../../auth/hooks/useAuth';

export interface CartContextType {
  cart: Cart | null;
  cartItemsCount: number;
  isLoading: boolean;
  error: string | null;
  addToCart: (
    productId: string,
    productName?: string,
    productPrice?: number,
    productImage?: string,
    originalPrice?: number,
    isOnSale?: boolean
  ) => Promise<void>;
  removeFromCart: (lineItemId: string) => Promise<void>;
  updateCartItemQuantity: (lineItemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

interface LocalCartItem {
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  isOnSale?: boolean;
  quantity: number;
  imageUrl: string;
}

const createLocalCart = (localItems: LocalCartItem[]): Cart => {
  const totalCentAmount = localItems.reduce(
    (total, item) => total + item.price * 100 * item.quantity,
    0
  );

  return {
    id: 'local-cart',
    version: 1,
    lineItems: localItems.map(
      (item, index): CartItem => ({
        id: `local-${index}`,
        productId: item.productId,
        name: item.name,
        price: item.price,
        originalPrice: item.originalPrice,
        isOnSale: item.isOnSale,
        quantity: item.quantity,
        imageUrl: item.imageUrl,
        variant: {
          id: 1,
          attributes: [],
        },
      })
    ),
    totalPrice: {
      centAmount: totalCentAmount,
      fractionDigits: 2,
      currencyCode: 'USD',
    },
  };
};

const LOCAL_CART_KEY = 'local-cart-items';

const getLocalCartItems = (): LocalCartItem[] => {
  try {
    const items = localStorage.getItem(LOCAL_CART_KEY);
    return items ? JSON.parse(items) : [];
  } catch {
    return [];
  }
};

const setLocalCartItems = (items: LocalCartItem[]) => {
  localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items));
};

const clearLocalCartItems = () => {
  localStorage.removeItem(LOCAL_CART_KEY);
};

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const syncCartWithServer = useCallback(async () => {
    const localItems = getLocalCartItems();

    if (localItems.length === 0) {
      return;
    }

    setCart(createLocalCart(localItems));
  }, []);

  const loadCart = useCallback(() => {
    const localItems = getLocalCartItems();

    if (localItems.length > 0) {
      setCart(createLocalCart(localItems));
    } else {
      setCart(null);
    }
  }, []);

  useEffect(() => {
    setError(null);

    loadCart();

    if (isAuthenticated) {
      syncCartWithServer();
    }
  }, [isAuthenticated, loadCart, syncCartWithServer]);

  const addToCart = async (
    productId: string,
    productName = 'Unknown Product',
    productPrice = 0,
    productImage = '',
    originalPrice?: number,
    isOnSale?: boolean
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const localItems = getLocalCartItems();
      const existingItemIndex = localItems.findIndex(item => item.productId === productId);

      if (existingItemIndex >= 0) {
        localItems[existingItemIndex].quantity += 1;
      } else {
        localItems.push({
          productId,
          name: productName,
          price: productPrice,
          originalPrice,
          isOnSale,
          quantity: 1,
          imageUrl: productImage,
        });
      }

      setLocalCartItems(localItems);
      setCart(createLocalCart(localItems));
    } catch {
      setError('Failed to add item to cart');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (lineItemId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const localItems = getLocalCartItems();
      const itemIndex = parseInt(lineItemId.replace('local-', ''));

      if (itemIndex >= 0 && itemIndex < localItems.length) {
        localItems.splice(itemIndex, 1);
        setLocalCartItems(localItems);
        setCart(localItems.length > 0 ? createLocalCart(localItems) : null);
      }
    } catch {
      setError('Failed to remove item from cart');
    } finally {
      setIsLoading(false);
    }
  };

  const updateCartItemQuantity = async (lineItemId: string, quantity: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const localItems = getLocalCartItems();
      const itemIndex = parseInt(lineItemId.replace('local-', ''));

      if (itemIndex >= 0 && itemIndex < localItems.length) {
        if (quantity <= 0) {
          localItems.splice(itemIndex, 1);
        } else {
          localItems[itemIndex].quantity = quantity;
        }

        setLocalCartItems(localItems);
        setCart(localItems.length > 0 ? createLocalCart(localItems) : null);
      }
    } catch {
      setError('Failed to update item quantity');
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    setIsLoading(true);
    setError(null);

    try {
      clearLocalCartItems();
      setCart(null);
    } catch {
      setError('Failed to clear cart');
    } finally {
      setIsLoading(false);
    }
  };

  const cartItemsCount = cart?.lineItems.reduce((total, item) => total + item.quantity, 0) || 0;

  const value: CartContextType = {
    cart,
    cartItemsCount,
    isLoading,
    error,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
