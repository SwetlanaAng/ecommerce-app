import {
  getActiveCart,
  createCart,
  addLineItem,
  removeLineItem,
  deleteCart,
  changeLineItemQuantity,
} from './cart.service';
import { getTokenFromStorage } from './registration.service';
import { Cart, CartItem } from '../types/interfaces';

interface ApiPrice {
  value?: {
    centAmount: number;
    fractionDigits: number;
    currencyCode: string;
  };
  discounted?: {
    value?: {
      centAmount: number;
      fractionDigits: number;
      currencyCode: string;
    };
  };
}

interface ApiLineItem {
  id: string;
  productId: string;
  name?: { [key: string]: string } | string;
  price?: ApiPrice;
  quantity: number;
  variant?: {
    id: number;
    images?: Array<{ url: string }>;
    attributes?: Array<{
      name: string;
      value: unknown;
    }>;
  };
}

interface ApiCart {
  id: string;
  version: number;
  lineItems?: ApiLineItem[];
  totalPrice?: {
    centAmount: number;
    fractionDigits: number;
    currencyCode: string;
  };
  discountCodes?: Array<{
    discountCode: {
      id: string;
      typeId: string;
    };
  }>;
}

function adaptCartData(apiCart: ApiCart): Cart {
  const adaptedLineItems: CartItem[] =
    apiCart.lineItems?.map((apiItem: ApiLineItem) => {
      const price = apiItem.price?.value?.centAmount
        ? apiItem.price.value.centAmount / Math.pow(10, apiItem.price.value.fractionDigits)
        : 0;

      const originalPrice =
        apiItem.price?.discounted?.value?.centAmount && apiItem.price?.value?.centAmount
          ? apiItem.price.value.centAmount / Math.pow(10, apiItem.price.value.fractionDigits)
          : undefined;

      const isOnSale = !!apiItem.price?.discounted;

      const finalPrice =
        isOnSale && apiItem.price?.discounted?.value?.centAmount
          ? apiItem.price.discounted.value.centAmount /
            Math.pow(10, apiItem.price.discounted.value.fractionDigits)
          : price;

      return {
        id: apiItem.id,
        productId: apiItem.productId,
        name:
          typeof apiItem.name === 'string'
            ? apiItem.name
            : apiItem.name?.['en-US'] || 'Unknown Product',
        price: finalPrice,
        originalPrice: isOnSale ? originalPrice : undefined,
        isOnSale,
        quantity: apiItem.quantity || 1,
        imageUrl: apiItem.variant?.images?.[0]?.url || '',
        variant: {
          id: apiItem.variant?.id || 1,
          attributes: apiItem.variant?.attributes || [],
        },
      };
    }) || [];

  return {
    id: apiCart.id,
    version: apiCart.version,
    lineItems: adaptedLineItems,
    totalPrice: {
      centAmount: apiCart.totalPrice?.centAmount || 0,
      fractionDigits: apiCart.totalPrice?.fractionDigits || 2,
      currencyCode: apiCart.totalPrice?.currencyCode || 'USD',
    },
    discountCodes: apiCart.discountCodes || [],
  };
}

export async function getCart(): Promise<Cart> {
  const token = await getTokenFromStorage();

  try {
    const apiCart = await getActiveCart(token);
    return adaptCartData(apiCart);
  } catch {
    const apiCart = await createCart(token);
    return adaptCartData(apiCart);
  }
}

export async function clearCart(): Promise<Cart | null> {
  const currentCart = await getCart();
  await deleteCart(currentCart.id, currentCart.version);

  try {
    const apiCart = await createCart();
    return adaptCartData(apiCart);
  } catch (err) {
    console.error('Error clearing cart:', err);
    return null;
  }
}

export async function getSpecificCart(token: string): Promise<Cart | null> {
  try {
    const apiCart = await getActiveCart(token);
    return adaptCartData(apiCart);
  } catch {
    try {
      const apiCart = await createCart(token);
      return adaptCartData(apiCart);
    } catch (err) {
      console.error('Error getting cart:', err);
      return null;
    }
  }
}

export async function getProductsInCart(): Promise<string[]> {
  try {
    const cart = await getCart();
    const lineItems = cart.lineItems || [];
    return lineItems.map((item: CartItem) => item.productId);
  } catch (error) {
    console.error('Error getting products from cart:', error);
    return [];
  }
}

export async function sendToCart(productId: string): Promise<Cart | null> {
  try {
    const apiResponse = await addLineItem(productId);
    return adaptCartData(apiResponse);
  } catch (error) {
    console.error('Error adding product to cart:', error);
    return null;
  }
}

export async function removeFromCart(productId: string): Promise<Cart | null> {
  try {
    const cart = await getCart();
    const lineItems = cart.lineItems || [];
    const lineItem = lineItems.find((item: CartItem) => item.productId === productId);

    if (!lineItem) {
      throw new Error('Product not found in cart');
    }

    const apiResponse = await removeLineItem(lineItem.id);
    return adaptCartData(apiResponse);
  } catch (error) {
    console.error('Error removing product from cart:', error);
    return null;
  }
}

export async function removeLineItemFromCart(lineItemId: string): Promise<Cart | null> {
  try {
    const apiResponse = await removeLineItem(lineItemId);
    return adaptCartData(apiResponse);
  } catch (error) {
    console.error('Error removing product from cart:', error);
    return null;
  }
}

export async function updateCartItemQuantity(
  productId: string,
  quantity: number
): Promise<Cart | null> {
  try {
    const cart = await getCart();
    const lineItems = cart.lineItems || [];
    const lineItem = lineItems.find((item: CartItem) => item.productId === productId);

    if (!lineItem) {
      throw new Error('Product not found in cart');
    }

    const apiResponse = await changeLineItemQuantity(lineItem.id, quantity);
    return adaptCartData(apiResponse);
  } catch (error) {
    console.error('Error updating product quantity:', error);
    return null;
  }
}

export async function updateLineItemQuantity(
  lineItemId: string,
  quantity: number
): Promise<Cart | null> {
  try {
    const apiResponse = await changeLineItemQuantity(lineItemId, quantity);
    return adaptCartData(apiResponse);
  } catch (error) {
    console.error('Error updating product quantity:', error);
    return null;
  }
}

export async function isProductInCart(productId: string): Promise<boolean> {
  try {
    const productsInCart = await getProductsInCart();
    return productsInCart.includes(productId);
  } catch (error) {
    console.error('Error checking product in cart:', error);
    return false;
  }
}

export async function getCartItemsCount(): Promise<number> {
  try {
    const cart = await getCart();
    const lineItems = cart.lineItems || [];
    return lineItems.reduce((total: number, item: CartItem) => total + item.quantity, 0);
  } catch (error) {
    console.error('Error counting products in cart:', error);
    return 0;
  }
}

export async function getCartTotal(): Promise<{ amount: number; currency: string } | null> {
  try {
    const cart = await getCart();
    if (!cart.totalPrice) {
      return { amount: 0, currency: 'USD' };
    }

    const amount = cart.totalPrice.centAmount / Math.pow(10, cart.totalPrice.fractionDigits);
    return {
      amount,
      currency: cart.totalPrice.currencyCode,
    };
  } catch (error) {
    console.error('Error getting cart total:', error);
    return null;
  }
}
