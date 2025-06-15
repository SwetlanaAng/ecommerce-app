import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getPromoCodesWithDetails,
  getActiveDiscountCodes,
  PromoCodeData,
} from '../services/promocodes.service';
import { getCartWithPromoCode, removeDiscountCode } from '../services/cart.service';
import { getTokenFromStorage } from '../services/registration.service';

export interface ActivePromoCode {
  id: string;
  name?: string;
  code?: string;
}

export interface CartDiscountCode {
  discountCode: {
    id: string;
    typeId: string;
  };
}

export interface UsePromoCodeReturn {
  availablePromoCodes: PromoCodeData[];
  isLoadingAvailable: boolean;
  availableError: string | null;

  activePromoCodes: ActivePromoCode[];
  promoCodeError: string | null;

  addPromoCode: (
    code: string,
    cartId: string,
    cartVersion: number
  ) => Promise<{ success: boolean; result?: unknown; error?: string }>;
  removePromoCode: (
    promocodeId: string,
    cartId: string,
    cartVersion: number
  ) => Promise<{ success: boolean; result?: unknown }>;
  refreshAvailablePromoCodes: () => Promise<void>;
  updateActivePromoCodes: (cartDiscountCodes: CartDiscountCode[]) => Promise<void>;
}

const memoryCache: {
  data: PromoCodeData[] | null;
  timestamp: number;
  isLoading: boolean;
} = {
  data: null,
  timestamp: 0,
  isLoading: false,
};

const CACHE_DURATION = 30 * 60 * 1000;

export const usePromoCode = (): UsePromoCodeReturn => {
  const [availablePromoCodes, setAvailablePromoCodes] = useState<PromoCodeData[]>([]);
  const [isLoadingAvailable, setIsLoadingAvailable] = useState(true);
  const [availableError, setAvailableError] = useState<string | null>(null);

  const [activePromoCodes, setActivePromoCodes] = useState<ActivePromoCode[]>([]);
  const [promoCodeError, setPromoCodeError] = useState<string | null>(null);

  const isInitialMount = useRef(true);

  const isCacheValid = useCallback(() => {
    return memoryCache.data && Date.now() - memoryCache.timestamp < CACHE_DURATION;
  }, []);

  const fetchAvailablePromoCodes = useCallback(async () => {
    if (memoryCache.isLoading) {
      const checkLoading = () => {
        return new Promise<void>(resolve => {
          const interval = setInterval(() => {
            if (!memoryCache.isLoading) {
              clearInterval(interval);
              resolve();
            }
          }, 100);
        });
      };

      await checkLoading();

      if (memoryCache.data) {
        setAvailablePromoCodes(memoryCache.data);
        setIsLoadingAvailable(false);
        setAvailableError(null);
        return;
      }
    }

    if (isCacheValid() && memoryCache.data) {
      setAvailablePromoCodes(memoryCache.data);
      setIsLoadingAvailable(false);
      setAvailableError(null);
      return;
    }

    try {
      setIsLoadingAvailable(true);
      setAvailableError(null);
      memoryCache.isLoading = true;

      const data = await getPromoCodesWithDetails();

      memoryCache.data = data;
      memoryCache.timestamp = Date.now();

      setAvailablePromoCodes(data);
    } catch (error) {
      setAvailableError('Failed to load promo codes');
      console.error('Error fetching promo codes:', error);
    } finally {
      setIsLoadingAvailable(false);
      memoryCache.isLoading = false;
    }
  }, [isCacheValid]);

  const refreshAvailablePromoCodes = useCallback(async () => {
    memoryCache.data = null;
    memoryCache.timestamp = 0;
    await fetchAvailablePromoCodes();
  }, [fetchAvailablePromoCodes]);

  const updateActivePromoCodes = useCallback(async (cartDiscountCodes: CartDiscountCode[]) => {
    if (!cartDiscountCodes || cartDiscountCodes.length === 0) {
      setActivePromoCodes([]);
      return;
    }

    try {
      const allDiscountCodes = await getActiveDiscountCodes();
      const promoCodes = cartDiscountCodes.map(dc => {
        const details = allDiscountCodes.find(code => code.id === dc.discountCode.id);
        return {
          id: dc.discountCode.id,
          name: details?.name?.['en-US'],
          code: details?.code,
        };
      });
      setActivePromoCodes(promoCodes);
    } catch {
      const promoCodes = cartDiscountCodes.map(dc => ({ id: dc.discountCode.id }));
      setActivePromoCodes(promoCodes);
    }
  }, []);

  const addPromoCode = useCallback(async (code: string, cartId: string, cartVersion: number) => {
    setPromoCodeError(null);

    try {
      const token = await getTokenFromStorage();
      const result = await getCartWithPromoCode(code, cartId, token, cartVersion.toString());

      if (typeof result === 'string') {
        setPromoCodeError(result);
        return { success: false, error: result };
      }

      return { success: true, result };
    } catch {
      const errorMessage = 'Failed to add promo code';
      setPromoCodeError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const removePromoCode = useCallback(
    async (promocodeId: string, cartId: string, cartVersion: number) => {
      setPromoCodeError(null);

      try {
        const token = await getTokenFromStorage();
        const result = await removeDiscountCode(cartId, token, cartVersion.toString(), promocodeId);

        if (result) {
          return { success: true, result };
        }

        return { success: false };
      } catch {
        setPromoCodeError('Failed to remove promo code');
        return { success: false };
      }
    },
    []
  );

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      fetchAvailablePromoCodes();
    }
  }, [fetchAvailablePromoCodes]);

  return {
    availablePromoCodes,
    isLoadingAvailable,
    availableError,
    activePromoCodes,
    promoCodeError,
    addPromoCode,
    removePromoCode,
    refreshAvailablePromoCodes,
    updateActivePromoCodes,
  };
};
