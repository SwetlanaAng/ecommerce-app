import { getDiscountCodesData, getCartDiscountsData } from './local-data.service';
import { DiscountCode, CartDiscount } from '../types/interfaces';

export interface PromoCodeData {
  code: string;
  name: string;
  description: string;
  discount: string;
  validUntil?: string;
  isActive: boolean;
}

export async function getActiveDiscountCodes(): Promise<DiscountCode[]> {
  try {
    const allDiscountCodes = getDiscountCodesData();
    return allDiscountCodes.filter(code => code.isActive);
  } catch (error) {
    console.error('Error getting active discount codes:', error);
    return [];
  }
}

export async function getCartDiscount(discountId: string): Promise<CartDiscount | null> {
  try {
    const cartDiscounts = getCartDiscountsData();
    return cartDiscounts.find(d => d.id === discountId) || null;
  } catch (error) {
    console.error('Error getting cart discount:', error);
    return null;
  }
}

export async function getPromoCodesWithDetails(): Promise<PromoCodeData[]> {
  try {
    const discountCodes = await getActiveDiscountCodes();
    const promoCodesWithDetails: PromoCodeData[] = [];

    for (const discountCode of discountCodes) {
      if (discountCode.cartDiscounts.length > 0) {
        const cartDiscount = await getCartDiscount(discountCode.cartDiscounts[0].id);

        if (cartDiscount) {
          let discountText = 'DISCOUNT';

          if (cartDiscount.value?.type === 'relative') {
            const percentage = cartDiscount.value.permyriad / 100;
            discountText = `${percentage}%`;
          } else if (cartDiscount.value?.type === 'absolute') {
            const value = cartDiscount.value as unknown as {
              money: { centAmount: number; currencyCode: string }[];
            };
            if (value.money && value.money.length > 0) {
              const amount = value.money[0].centAmount / 100;
              const currency = value.money[0].currencyCode || 'USD';
              discountText = `${amount} ${currency}`;
            }
          }

          promoCodesWithDetails.push({
            code: discountCode.code,
            name: discountCode.name?.['en-US'] || discountCode.code,
            description:
              discountCode.description?.['en-US'] ||
              cartDiscount.description?.['en-US'] ||
              'Special discount available',
            discount: discountText,
            validUntil: discountCode.validUntil,
            isActive: discountCode.isActive,
          });
        }
      }
    }

    return promoCodesWithDetails;
  } catch (error) {
    console.error('Error getting promo codes with details:', error);
    return [];
  }
}
