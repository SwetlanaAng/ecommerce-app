import { useEffect } from 'react';
import { useCart } from '../features/cart/hooks/useCart';
import { usePromoCode } from './usePromoCode';

export const useCartWithPromoCodes = () => {
  const { cart, refreshCart, ...cartMethods } = useCart();
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

    const result = await addPromoCode(code, cart.id, cart.version);

    if (result.success && result.result) {
      await refreshCart();
      return true;
    }

    return false;
  };

  const handleRemovePromoCode = async (promocodeId: string): Promise<void> => {
    if (!cart) return;

    const result = await removePromoCode(promocodeId, cart.id, cart.version);

    if (result.success) {
      await refreshCart();
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
