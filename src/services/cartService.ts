import { KEYS } from './keys';

export type CartActionType = {
  action: string;
  lineItemId?: string;
  quantity?: number;
};

const apiUrl = KEYS.API_URL;
const projectKey = KEYS.PROJECT_KEY;

async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function getActiveCart(token: string) {
  try {
    const response = await fetch(`${apiUrl}/${projectKey}/me/active-cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await handleResponse(response);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function createCart(token: string) {
  try {
    const response = await fetch(`${apiUrl}/${projectKey}/me/carts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currency: 'USD',
        country: 'US',
      }),
    });
    return await handleResponse(response);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function addLineItem(
  productId: string,
  token: string,
  cartId: string,
  cartVersion: number
) {
  try {
    const response = await fetch(`${apiUrl}/${projectKey}/me/carts/${cartId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: cartVersion,
        actions: [
          {
            action: 'addLineItem',
            productId: `${productId}`,
            quantity: 1,
          },
        ],
      }),
    });
    return await handleResponse(response);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function removeLineItem(
  lineItemId: string,
  token: string,
  cartId: string,
  cartVersion: number
) {
  try {
    const response = await fetch(`${apiUrl}/${projectKey}/me/carts/${cartId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: cartVersion,
        actions: [
          {
            action: 'removeLineItem',
            lineItemId,
          },
        ],
      }),
    });
    return await handleResponse(response);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function updateCart(token: string, cartId: string, cartVersion: number) {
  try {
    const response = await fetch(`${apiUrl}/${projectKey}/me/carts/${cartId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: cartVersion,
        actions: [
          {
            action: 'setCountry',
            country: 'DE',
          },
        ],
      }),
    });
    return await handleResponse(response);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function updateProductInCart(
  token: string,
  id: string,
  actions: CartActionType[],
  version: number
) {
  try {
    const response = await fetch(`${apiUrl}/${projectKey}/me/carts/${id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ version, actions }),
    });
    return await handleResponse(response);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function deleteCart(token: string, id: string, version: number) {
  try {
    const response = await fetch(`${apiUrl}/${projectKey}/me/carts/${id}?version=${version}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function getCartWithPromoCode(
  inputValue: string,
  cartId: string,
  token: string,
  cartVersion: string
) {
  const requestBody = {
    version: cartVersion,
    actions: [
      {
        action: 'addDiscountCode',
        code: inputValue,
      },
    ],
  };

  try {
    const response = await fetch(`${apiUrl}/${projectKey}/me/carts/${cartId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      return await response.json();
    } else if (response.status === 400) {
      return 'No such promo code';
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function removeDiscountCode(
  cartId: string,
  token: string,
  cartVersion: string,
  promocodeId: string
) {
  const requestBody = {
    version: cartVersion,
    actions: [
      {
        action: 'removeDiscountCode',
        discountCode: {
          typeId: 'discount-code',
          id: `${promocodeId}`,
        },
      },
    ],
  };

  try {
    const response = await fetch(`${apiUrl}/${projectKey}/me/carts/${cartId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      return 'success';
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
}
