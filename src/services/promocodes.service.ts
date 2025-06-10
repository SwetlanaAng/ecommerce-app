import { KEYS } from './keys';
import { getTokenFromStorage } from './registration.service';

const apiUrl = KEYS.API_URL;
const projectKey = KEYS.PROJECT_KEY;

async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export interface DiscountCode {
  id: string;
  code: string;
  name?: {
    [key: string]: string;
  };
  description?: {
    [key: string]: string;
  };
  isActive: boolean;
  validFrom?: string;
  validUntil?: string;
  cartDiscounts: Array<{
    typeId: string;
    id: string;
  }>;
}

export interface DiscountCodesResponse {
  results: DiscountCode[];
  count: number;
  total: number;
  offset: number;
  limit: number;
}

export async function getActiveDiscountCodes(token?: string): Promise<DiscountCode[]> {
  const authToken = token || (await getTokenFromStorage());

  try {
    const response = await fetch(
      `${apiUrl}/${projectKey}/discount-codes?where=isActive%3Dtrue&limit=20`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    const data: DiscountCodesResponse = await handleResponse(response);
    return data.results;
  } catch {
    return [];
  }
}

export async function getCartDiscount(discountId: string, token?: string) {
  const authToken = token || (await getTokenFromStorage());

  try {
    const response = await fetch(`${apiUrl}/${projectKey}/cart-discounts/${discountId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return await handleResponse(response);
  } catch {
    return null;
  }
}

export interface PromoCodeData {
  code: string;
  name: string;
  description: string;
  discount: string;
  validUntil?: string;
  isActive: boolean;
}

export async function getPromoCodesWithDetails(token?: string): Promise<PromoCodeData[]> {
  const discountCodes = await getActiveDiscountCodes(token);
  const promoCodesWithDetails: PromoCodeData[] = [];

  for (const discountCode of discountCodes) {
    if (discountCode.cartDiscounts.length > 0) {
      const cartDiscount = await getCartDiscount(discountCode.cartDiscounts[0].id, token);

      if (cartDiscount) {
        let discountText = 'DISCOUNT';

        if (cartDiscount.value?.type === 'relative') {
          const percentage = cartDiscount.value.permyriad / 100;
          discountText = `${percentage}%`;
        } else if (cartDiscount.value?.type === 'absolute') {
          const amount = cartDiscount.value.money?.centAmount / 100;
          const currency = cartDiscount.value.money?.currencyCode || 'USD';
          discountText = `${amount} ${currency}`;
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
}

export async function ensureTestPromoCodes(token?: string): Promise<void> {
  const authToken = token || (await getTokenFromStorage());

  try {
    const existingCodes = await getActiveDiscountCodes(authToken);

    if (existingCodes.length === 0) {
      console.log('No active discount codes found. Please create these codes in commercetools:');
    }
  } catch (error) {
    console.error('Error checking discount codes:', error);
  }
}
