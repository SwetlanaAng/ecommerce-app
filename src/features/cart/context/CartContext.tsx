import React, { useState, useEffect, ReactNode, useCallback } from 'react';
import {
  getCart,
  sendToCart,
  removeLineItemFromCart,
  updateLineItemQuantity,
  clearCart as clearCartLogic,
  addProductToCart,
} from '../../../services/cart.logic';
import { CartContext, CartContextType } from './CartContextType';
import { Cart } from '../../../types/interfaces';

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
    } catch (err) {
      console.error(err);
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
    } catch (err) {
      console.error(err);
      setError('Failed to add item to cart');
    } finally {
      setIsLoading(false);
    }
  };

  const addProductToCartWithDetails = async (productDetails: {
    productId: string;
    name: string;
    price: number;
    imageUrl: string;
    variant?: {
      id: number;
      attributes: Array<{ name: string; value: unknown }>;
    };
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedCart = await addProductToCart(productDetails);
      if (updatedCart) {
        setCart(updatedCart);
      } else {
        await refreshCart();
      }
    } catch (err) {
      console.error(err);
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
    } catch (err) {
      console.error(err);
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
    } catch (err) {
      console.error(err);
      setError('Failed to update item quantity');
      setCart(cart);
    }
  };

  const clearCart = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedCart = await clearCartLogic();
      setCart(updatedCart);
    } catch (err) {
      console.error(err);
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
    addProductToCart: addProductToCartWithDetails,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    refreshCart,
    setCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
