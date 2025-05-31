import { KEYS } from './keys';

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
  const response = await fetch(`${apiUrl}/${projectKey}/me/active-cart`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await handleResponse(response);
}

export async function createCart(token: string) {
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
}

export async function addLineItem(
  productId: string,
  token: string,
  cartId: string,
  cartVersion: number
) {
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
}

export async function removeLineItem(
  lineItemId: string,
  token: string,
  cartId: string,
  cartVersion: number
) {
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
}

export async function deleteCart(token: string, id: string, version: number) {
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
}
