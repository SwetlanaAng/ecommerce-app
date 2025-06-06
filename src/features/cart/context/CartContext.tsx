import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Cart } from '../../../types/interfaces';
import {
  getCart,
  sendToCart,
  removeLineItemFromCart,
  updateLineItemQuantity,
  clearCart as clearCartLogic,
} from '../../../services/cart.logic';

export interface CartContextType {
  cart: Cart | null;
  cartItemsCount: number;
  isLoading: boolean;
  error: string | null;
  addToCart: (productId: string) => Promise<void>;
  removeFromCart: (lineItemId: string) => Promise<void>;
  updateCartItemQuantity: (lineItemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  setCart: (cart: Cart) => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshCart = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const cartData = await getCart();
      setCart(cartData);
    } catch {
      setError('Failed to load cart');
      setCart(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (productId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedCart = await sendToCart(productId);
      if (updatedCart) {
        setCart(updatedCart);
      } else {
        await refreshCart();
      }
    } catch {
      setError('Failed to add item to cart');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (lineItemId: string) => {
    if (!cart) return;

    setError(null);

    const optimisticCart = {
      ...cart,
      lineItems: cart.lineItems.filter(item => item.id !== lineItemId),
    };
    setCart(optimisticCart);

    try {
      const updatedCart = await removeLineItemFromCart(lineItemId);
      if (updatedCart) {
        setCart(updatedCart);
      }
    } catch {
      setError('Failed to remove item from cart');
      setCart(cart);
    }
  };

  const updateCartItemQuantity = async (lineItemId: string, quantity: number) => {
    if (!cart) return;

    setError(null);

    const optimisticCart = {
      ...cart,
      lineItems: cart.lineItems.map(item =>
        item.id === lineItemId ? { ...item, quantity } : item
      ),
    };

    const newTotalCentAmount = optimisticCart.lineItems.reduce((total, item) => {
      const itemPriceCents = Math.round(item.price * Math.pow(10, cart.totalPrice.fractionDigits));
      return total + itemPriceCents * item.quantity;
    }, 0);

    optimisticCart.totalPrice = {
      ...cart.totalPrice,
      centAmount: newTotalCentAmount,
    };

    setCart(optimisticCart);

    try {
      const updatedCart = await updateLineItemQuantity(lineItemId, quantity);
      if (updatedCart) {
        setCart(updatedCart);
      }
    } catch {
      setError('Failed to update item quantity');
      setCart(cart);
    }
  };

  const clearCart = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await clearCartLogic();
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
    refreshCart,
    setCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
