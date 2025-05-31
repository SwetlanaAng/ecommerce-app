import { KEYS } from './keys';
import { RegistrationData, ResultProps } from '../types/interfaces';
import { tokenNames } from '../types/tokenNames';

const { userToken, anonymous, anonymousRefresh } = tokenNames;

export const countryId: Record<string, string> = {
  US: 'United States',
  DE: 'Germany',
};

export async function getBasicToken(): Promise<string> {
  try {
    const response = await fetch(`${KEYS.AUTH_URL}/oauth/token?grant_type=client_credentials`, {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + btoa(`${KEYS.CLIENT_ID}:${KEYS.CLIENT_SECRET}`),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get API access token');
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Failed to get token:', error);
    throw error;
  }
}

export function dataAdapter(data: RegistrationData): RegistrationData {
  try {
    const adaptedData = { ...data };
    adaptedData.billingAddress = { ...data.billingAddress };
    adaptedData.shippingAddress = { ...data.shippingAddress };

    adaptedData.billingAddress.country =
      countryId[data.billingAddress.country] || data.billingAddress.country;
    adaptedData.shippingAddress.country =
      countryId[data.shippingAddress.country] || data.shippingAddress.country;

    return adaptedData;
  } catch (error) {
    console.log('Error adapting address data:', error);
    return data;
  }
}

export async function createCustomer(data: RegistrationData): Promise<ResultProps> {
  try {
    const token = await getBasicToken();
    const billingDefaultIndex = data.billingAddress.isDefault ? 0 : undefined;
    const shippingDefaultIndex = data.shippingAddress.isDefault ? 1 : undefined;

    const billingCountryCode =
      Object.entries(countryId).find(([, name]) => name === data.billingAddress.country)?.[0] ||
      data.billingAddress.country;
    const shippingCountryCode =
      Object.entries(countryId).find(([, name]) => name === data.shippingAddress.country)?.[0] ||
      data.shippingAddress.country;

    const response = await fetch(`${KEYS.API_URL}/${KEYS.PROJECT_KEY}/customers`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        firstName: data.firstName,
        lastName: data.secondName,
        password: data.password,
        dateOfBirth: data.date,
        addresses: [
          {
            country: billingCountryCode,
            city: data.billingAddress.city,
            streetName: data.billingAddress.street,
            postalCode: data.billingAddress.postalCode,
          },
          {
            country: shippingCountryCode,
            city: data.shippingAddress.city,
            streetName: data.shippingAddress.street,
            postalCode: data.shippingAddress.postalCode,
          },
        ],
        billingAddresses: [0],
        shippingAddresses: [1],
        defaultBillingAddress: billingDefaultIndex,
        defaultShippingAddress: shippingDefaultIndex,
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      return {
        isSuccess: false,
        message: responseData.message || 'Registration failed',
      };
    }

    return {
      isSuccess: true,
      message: responseData.customer?.id || 'Registration successful',
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      isSuccess: false,
      message: error instanceof Error ? error.message : 'Registration failed',
    };
  }
}

export async function getAnonymousToken() {
  try {
    const response = await fetch(
      `${KEYS.AUTH_URL}/oauth/${KEYS.PROJECT_KEY}/anonymous/token?grant_type=client_credentials`,
      {
        method: 'POST',
        headers: {
          Authorization: 'Basic ' + btoa(`${KEYS.CLIENT_ID}:${KEYS.CLIENT_SECRET}`),
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to get anonymous token');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to get anonymous token:', error);
    throw error;
  }
}

export const setAnonymousToken = async () => {
  try {
    const tokenData = await getAnonymousToken();
    localStorage.setItem(anonymous, JSON.stringify(tokenData));
    localStorage.setItem(anonymousRefresh, tokenData.refresh_token);
  } catch (error) {
    console.error('Failed to set anonymous token:', error);
    throw error;
  }
};

export async function introspectToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${KEYS.AUTH_URL}/oauth/introspect?token=${token}`, {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + btoa(`${KEYS.CLIENT_ID}:${KEYS.CLIENT_SECRET}`),
      },
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.active;
  } catch (error) {
    console.error('Token introspection failed:', error);
    return false;
  }
}

export async function refreshToken(refreshTokenValue: string) {
  try {
    const response = await fetch(
      `${KEYS.AUTH_URL}/oauth/token?grant_type=refresh_token&refresh_token=${refreshTokenValue}`,
      {
        method: 'POST',
        headers: {
          Authorization: 'Basic ' + btoa(`${KEYS.CLIENT_ID}:${KEYS.CLIENT_SECRET}`),
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    return await response.json();
  } catch (error) {
    console.error('Token refresh failed:', error);
    throw error;
  }
}

async function setRefreshedToken(storageKey: string) {
  try {
    const refresh = localStorage.getItem(`${storageKey}Refresh`);
    if (!refresh) {
      throw new Error('No refresh token found');
    }

    const newToken = await refreshToken(refresh);
    localStorage.setItem(storageKey, JSON.stringify(newToken));
    return newToken.access_token;
  } catch (error) {
    console.error('Failed to set refreshed token:', error);
    throw error;
  }
}

export async function getTokenFromStorage(): Promise<string> {
  const isLoggedIn = !!localStorage.getItem(userToken);
  const isSeenBefore = !!localStorage.getItem(anonymous);

  if (!isLoggedIn && !isSeenBefore) {
    await setAnonymousToken();
  }

  const token = isLoggedIn
    ? JSON.parse(localStorage.getItem(userToken) || '{}').access_token
    : JSON.parse(localStorage.getItem(anonymous) || '{}').access_token;

  const isTokenValid = await introspectToken(token);

  if (isTokenValid) {
    return token;
  } else if (isLoggedIn) {
    return await setRefreshedToken(userToken);
  } else {
    return await setRefreshedToken(anonymous);
  }
}
