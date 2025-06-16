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

export async function getActiveCart(token?: string) {
  const authToken = token || (await getTokenFromStorage());
  const response = await fetch(`${apiUrl}/${projectKey}/me/active-cart`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  return await handleResponse(response);
}

export async function createCart(token?: string) {
  const authToken = token || (await getTokenFromStorage());
  const response = await fetch(`${apiUrl}/${projectKey}/me/carts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      currency: 'USD',
      country: 'US',
    }),
  });
  return await handleResponse(response);
}

export async function addLineItem(
  productId: string,
  cartId?: string,
  cartVersion?: number,
  token?: string
) {
  const authToken = token || (await getTokenFromStorage());

  let activeCartId = cartId;
  let activeCartVersion = cartVersion;

  if (!activeCartId || !activeCartVersion) {
    try {
      const activeCart = await getActiveCart(authToken);
      activeCartId = activeCart.id;
      activeCartVersion = activeCart.version;
    } catch {
      const newCart = await createCart(authToken);
      activeCartId = newCart.id;
      activeCartVersion = newCart.version;
    }
  }

  const response = await fetch(`${apiUrl}/${projectKey}/me/carts/${activeCartId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: activeCartVersion,
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
}

export async function removeLineItem(
  lineItemId: string,
  cartId?: string,
  cartVersion?: number,
  token?: string
) {
  const authToken = token || (await getTokenFromStorage());

  let activeCartId = cartId;
  let activeCartVersion = cartVersion;

  if (!activeCartId || !activeCartVersion) {
    const activeCart = await getActiveCart(authToken);
    activeCartId = activeCart.id;
    activeCartVersion = activeCart.version;
  }

  const response = await fetch(`${apiUrl}/${projectKey}/me/carts/${activeCartId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: activeCartVersion,
      actions: [
        {
          action: 'removeLineItem',
          lineItemId,
        },
      ],
    }),
  });
  return await handleResponse(response);
}

export async function deleteCart(id?: string, version?: number, token?: string) {
  const authToken = token || (await getTokenFromStorage());

  let cartId = id;
  let cartVersion = version;

  if (!cartId || !cartVersion) {
    const activeCart = await getActiveCart(authToken);
    cartId = activeCart.id;
    cartVersion = activeCart.version;
  }

  const response = await fetch(
    `${apiUrl}/${projectKey}/me/carts/${cartId}?version=${cartVersion}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export async function changeLineItemQuantity(
  lineItemId: string,
  quantity: number,
  cartId?: string,
  cartVersion?: number,
  token?: string
) {
  const authToken = token || (await getTokenFromStorage());

  let activeCartId = cartId;
  let activeCartVersion = cartVersion;

  if (!activeCartId || !activeCartVersion) {
    const activeCart = await getActiveCart(authToken);
    activeCartId = activeCart.id;
    activeCartVersion = activeCart.version;
  }

  const response = await fetch(`${apiUrl}/${projectKey}/me/carts/${activeCartId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: activeCartVersion,
      actions: [
        {
          action: 'changeLineItemQuantity',
          lineItemId,
          quantity,
        },
      ],
    }),
  });
  return await handleResponse(response);
}

export async function getCartById(cartId: string, token?: string) {
  const authToken = token || (await getTokenFromStorage());
  const response = await fetch(`${apiUrl}/${projectKey}/me/carts/${cartId}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  return await handleResponse(response);
}

export async function getMyCarts(token?: string) {
  const authToken = token || (await getTokenFromStorage());
  const response = await fetch(`${apiUrl}/${projectKey}/me/carts`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  return await handleResponse(response);
}

export async function getCartWithPromoCode(
  inputValue: string,
  cartId: string,
  token: string,
  cartVersion: string
) {
  const requestBody = {
    version: parseInt(cartVersion, 10),
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
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (response.status === 200) {
      return await response.json();
    } else if (response.status === 400) {
      const errorData = await response.json().catch(() => ({}));
      return errorData.message || 'Нет такого промокода';
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (e) {
    console.error('Error adding promo code:', e);
    return 'Нет такого промокода';
  }
}

export async function removeDiscountCode(
  cartId: string,
  token: string,
  cartVersion: string,
  promocodeId: string
) {
  const requestBody = {
    version: parseInt(cartVersion, 10),
    actions: [
      {
        action: 'removeDiscountCode',
        discountCode: {
          typeId: 'discount-code',
          id: promocodeId,
        },
      },
    ],
  };

  try {
    const response = await fetch(`${apiUrl}/${projectKey}/me/carts/${cartId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (response.status === 200) {
      return await response.json();
    } else {
      return null;
    }
  } catch (e) {
    console.error('Error removing promo code:', e);
    return null;
  }
}
