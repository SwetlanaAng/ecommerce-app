import { Cart, CartItem } from '../types/interfaces';
import { getProductById } from './product-local.service';
import toCardAdapter from '../lib/utils/productDataAdapters/toCardAdapter';
import { getCartDiscount } from './promocodes-local.service';
import { getDiscountCodesData } from './local-data.service';

const CART_STORAGE_KEY = 'local_cart';
const CART_VERSION_KEY = 'local_cart_version';

let localCart: Cart | null = null;
let cartVersion = 1;

function saveCartToStorage(cart: Cart): void {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    localStorage.setItem(CART_VERSION_KEY, cartVersion.toString());
  } catch (error) {
    console.error('Error saving cart to storage:', error);
  }
}

function loadCartFromStorage(): Cart | null {
  try {
    const cartData = localStorage.getItem(CART_STORAGE_KEY);
    const versionData = localStorage.getItem(CART_VERSION_KEY);

    if (cartData) {
      const cart = JSON.parse(cartData);
      cartVersion = versionData ? parseInt(versionData, 10) : 1;
      return cart;
    }
  } catch (error) {
    console.error('Error loading cart from storage:', error);
  }
  return null;
}

function createEmptyCart(): Cart {
  return {
    id: `cart_${Date.now()}`,
    version: cartVersion,
    lineItems: [],
    totalPrice: {
      centAmount: 0,
      fractionDigits: 2,
      currencyCode: 'USD',
    },
    discountCodes: [],
    discountOnTotalPrice: undefined,
  };
}

function calculateCartTotal(cart: Cart): number {
  return cart.lineItems.reduce((total, item) => {
    const itemPrice = typeof item.price === 'number' ? item.price : 0;
    return total + itemPrice * item.quantity;
  }, 0);
}

async function updateCartTotal(cart: Cart): Promise<Cart> {
  const newCart = { ...cart };
  const subtotal = calculateCartTotal(newCart);
  let totalDiscountAmount = 0;

  if (newCart.discountCodes && newCart.discountCodes.length > 0) {
    const allDiscountCodes = getDiscountCodesData();
    const discountCodeId = newCart.discountCodes[0].discountCode.id;
    const appliedDiscountCode = allDiscountCodes.find(dc => dc.id === discountCodeId);

    if (appliedDiscountCode && appliedDiscountCode.cartDiscounts.length > 0) {
      const cartDiscountId = appliedDiscountCode.cartDiscounts[0].id;
      const discountDetails = await getCartDiscount(cartDiscountId);
      if (discountDetails && discountDetails.value.type === 'relative') {
        totalDiscountAmount = (subtotal * discountDetails.value.permyriad) / 10000;
      }
    }
  }

  const discountedTotal = subtotal - totalDiscountAmount;

  newCart.totalPrice = {
    ...newCart.totalPrice,
    centAmount: Math.round(discountedTotal * Math.pow(10, newCart.totalPrice.fractionDigits)),
  };

  if (totalDiscountAmount > 0) {
    newCart.discountOnTotalPrice = {
      discountedAmount: {
        centAmount: Math.round(totalDiscountAmount * 100),
        currencyCode: 'USD',
        fractionDigits: 2,
      },
      includedDiscounts: [],
    };
  } else {
    delete newCart.discountOnTotalPrice;
  }

  return newCart;
}

function getLocalCart(): Cart {
  if (!localCart) {
    localCart = loadCartFromStorage() || createEmptyCart();
  }
  return localCart;
}

function saveCart(cart: Cart): void {
  localCart = cart;
  saveCartToStorage(cart);
}

export async function getCart(): Promise<Cart> {
  return getLocalCart();
}

export async function clearCart(): Promise<Cart> {
  const emptyCart = createEmptyCart();
  saveCart(emptyCart);
  return emptyCart;
}

export async function getSpecificCart(): Promise<Cart | null> {
  return getLocalCart();
}

export async function getProductsInCart(): Promise<string[]> {
  const cart = getLocalCart();
  return cart.lineItems.map(item => item.productId);
}

export async function sendToCart(productId: string): Promise<Cart | null> {
  try {
    const cart = getLocalCart();
    const existingItem = cart.lineItems.find(item => item.productId === productId);

    if (existingItem) {
      const updatedLineItems = cart.lineItems.map(item =>
        item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
      );

      const updatedCart = await updateCartTotal({
        ...cart,
        lineItems: updatedLineItems,
        version: cartVersion++,
      });

      saveCart(updatedCart);
      return updatedCart;
    } else {
      const product = await getProductById(productId);
      const cardData = await toCardAdapter(product);

      const newItem: CartItem = {
        id: `item_${Date.now()}`,
        productId,
        name: cardData.name,
        price: cardData.price,
        originalPrice: cardData.originalPrice,
        isOnSale: cardData.isOnSale,
        quantity: 1,
        imageUrl: cardData.imageUrl,
        variant: {
          id: 1,
          attributes: [],
        },
      };

      const updatedCart = await updateCartTotal({
        ...cart,
        lineItems: [...cart.lineItems, newItem],
        version: cartVersion++,
      });

      saveCart(updatedCart);
      return updatedCart;
    }
  } catch (error) {
    console.error('Error adding product to cart:', error);
    return null;
  }
}

export async function removeFromCart(productId: string): Promise<Cart | null> {
  try {
    const cart = getLocalCart();
    const updatedLineItems = cart.lineItems.filter(item => item.productId !== productId);

    const updatedCart = await updateCartTotal({
      ...cart,
      lineItems: updatedLineItems,
      version: cartVersion++,
    });

    saveCart(updatedCart);
    return updatedCart;
  } catch (error) {
    console.error('Error removing product from cart:', error);
    return null;
  }
}

export async function removeLineItemFromCart(lineItemId: string): Promise<Cart | null> {
  try {
    const cart = getLocalCart();
    const updatedLineItems = cart.lineItems.filter(item => item.id !== lineItemId);

    const updatedCart = await updateCartTotal({
      ...cart,
      lineItems: updatedLineItems,
      version: cartVersion++,
    });

    saveCart(updatedCart);
    return updatedCart;
  } catch (error) {
    console.error('Error removing line item from cart:', error);
    return null;
  }
}

export async function updateCartItemQuantity(
  productId: string,
  quantity: number
): Promise<Cart | null> {
  try {
    const cart = getLocalCart();
    const updatedLineItems = cart.lineItems.map(item =>
      item.productId === productId ? { ...item, quantity } : item
    );

    const updatedCart = await updateCartTotal({
      ...cart,
      lineItems: updatedLineItems,
      version: cartVersion++,
    });

    saveCart(updatedCart);
    return updatedCart;
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
    const cart = getLocalCart();
    const updatedLineItems = cart.lineItems.map(item =>
      item.id === lineItemId ? { ...item, quantity } : item
    );

    const updatedCart = await updateCartTotal({
      ...cart,
      lineItems: updatedLineItems,
      version: cartVersion++,
    });

    saveCart(updatedCart);
    return updatedCart;
  } catch (error) {
    console.error('Error updating line item quantity:', error);
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
    const cart = getLocalCart();
    return cart.lineItems.reduce((total, item) => total + item.quantity, 0);
  } catch (error) {
    console.error('Error counting products in cart:', error);
    return 0;
  }
}

export async function getCartTotal(): Promise<{ amount: number; currency: string } | null> {
  try {
    const cart = getLocalCart();
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

export async function addProductToCart(productDetails: {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  variant?: {
    id: number;
    attributes: Array<{ name: string; value: unknown }>;
  };
}): Promise<Cart | null> {
  try {
    const cart = getLocalCart();
    const existingItem = cart.lineItems.find(item => item.productId === productDetails.productId);

    if (existingItem) {
      const updatedLineItems = cart.lineItems.map(item =>
        item.productId === productDetails.productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );

      const updatedCart = await updateCartTotal({
        ...cart,
        lineItems: updatedLineItems,
        version: cartVersion++,
      });

      saveCart(updatedCart);
      return updatedCart;
    } else {
      const newItem: CartItem = {
        id: `item_${Date.now()}`,
        productId: productDetails.productId,
        name: productDetails.name,
        price: productDetails.price,
        quantity: 1,
        imageUrl: productDetails.imageUrl,
        variant: productDetails.variant || {
          id: 1,
          attributes: [],
        },
      };

      const updatedCart = await updateCartTotal({
        ...cart,
        lineItems: [...cart.lineItems, newItem],
        version: cartVersion++,
      });

      saveCart(updatedCart);
      return updatedCart;
    }
  } catch (error) {
    console.error('Error adding product to cart:', error);
    return null;
  }
}

export async function applyPromoCode(code: string): Promise<{
  success: boolean;
  cart?: Cart;
  error?: string;
}> {
  const allDiscountCodes = getDiscountCodesData();
  const discountCode = allDiscountCodes.find(dc => dc.code === code && dc.isActive);

  if (!discountCode) {
    return { success: false, error: 'Promo code not found or is not active.' };
  }

  const cart = getLocalCart();

  if (cart.discountCodes?.some(dc => dc.discountCode.id === discountCode.id)) {
    return { success: false, error: 'Promo code already applied.' };
  }

  const newDiscountCode = {
    discountCode: {
      id: discountCode.id,
      typeId: 'discount-code',
    },
  };

  cart.discountCodes = [...(cart.discountCodes || []), newDiscountCode];
  const updatedCart = await updateCartTotal(cart);

  saveCart(updatedCart);

  return { success: true, cart: updatedCart };
}

export async function removePromoCode(
  discountId: string
): Promise<{ success: boolean; cart?: Cart; error?: string }> {
  const cart = getLocalCart();

  if (!cart.discountCodes?.some(dc => dc.discountCode.id === discountId)) {
    return { success: false, error: 'Promo code not found in cart.' };
  }

  cart.discountCodes = cart.discountCodes.filter(dc => dc.discountCode.id !== discountId);

  const updatedCart = await updateCartTotal(cart);
  saveCart(updatedCart);
  return { success: true, cart: updatedCart };
}
