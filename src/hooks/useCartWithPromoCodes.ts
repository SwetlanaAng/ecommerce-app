import { useEffect } from 'react';
import { useCart } from '../features/cart/hooks/useCart';
import { usePromoCode } from './usePromoCode';
import { Cart } from '../types/interfaces';

export const useCartWithPromoCodes = () => {
  const { cart, setCart, ...cartMethods } = useCart();
  const {
    activePromoCodes,
    updateActivePromoCodes,
    addPromoCode,
    removePromoCode,
    promoCodeError,
  } = usePromoCode();

  useEffect(() => {
    if (cart?.discountCodes) {
      updateActivePromoCodes(cart.discountCodes);
    } else {
      updateActivePromoCodes([]);
    }
  }, [cart?.discountCodes, updateActivePromoCodes]);

  const handleAddPromoCode = async (code: string): Promise<boolean> => {
    if (!cart) return false;

    const result = await addPromoCode(code);

    if (result.success && result.result) {
      setCart(result.result as Cart);
      return true;
    }

    return false;
  };

  const handleRemovePromoCode = async (promocodeId: string): Promise<void> => {
    if (!cart) return;

    const result = await removePromoCode(promocodeId);

    if (result.success && result.result) {
      setCart(result.result as Cart);
    }
  };

  return {
    cart,
    ...cartMethods,

    activePromoCodes,
    promoCodeError,
    addPromoCode: handleAddPromoCode,
    removePromoCode: handleRemovePromoCode,
  };
};
