import { useEffect } from 'react';
import { useCart } from '../features/cart/hooks/useCart';
import { usePromoCode } from './usePromoCode';
import { adaptCartData, ApiCart } from '../services/cart.logic';

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

    const originalTotalPrice = cart.totalPrice.centAmount;
    const originalDiscountCodes = cart.discountCodes ? cart.discountCodes.length : 0;

    const result = await addPromoCode(code, cart.id, cart.version);

    if (result.success && result.result) {
      const adaptedCart = adaptCartData(result.result as ApiCart);

      const newTotalPrice = adaptedCart.totalPrice.centAmount;
      const newDiscountCodes = adaptedCart.discountCodes ? adaptedCart.discountCodes.length : 0;

      const priceChanged = newTotalPrice < originalTotalPrice;
      const discountCodeAdded = newDiscountCodes > originalDiscountCodes;

      const hasActiveDiscounts = adaptedCart.lineItems.some(
        item => item.appliedDiscounts && item.appliedDiscounts.length > 0
      );

      if (discountCodeAdded && !priceChanged && !hasActiveDiscounts) {
        const addedPromoCode = adaptedCart.discountCodes?.find(
          dc =>
            !cart.discountCodes?.some(
              originalDc => originalDc.discountCode.id === dc.discountCode.id
            )
        );

        if (addedPromoCode) {
          const removeResult = await removePromoCode(
            addedPromoCode.discountCode.id,
            adaptedCart.id,
            adaptedCart.version
          );
          if (removeResult.success && removeResult.result) {
            const finalCart = adaptCartData(removeResult.result as ApiCart);
            setCart(finalCart);
          } else {
            setCart(adaptedCart);
          }
        } else {
          setCart(adaptedCart);
        }

        return false;
      }

      setCart(adaptedCart);
      return priceChanged || hasActiveDiscounts;
    }

    return false;
  };

  const handleRemovePromoCode = async (promocodeId: string): Promise<void> => {
    if (!cart) return;

    const result = await removePromoCode(promocodeId, cart.id, cart.version);

    if (result.success && result.result) {
      const adaptedCart = adaptCartData(result.result as ApiCart);
      setCart(adaptedCart);
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
