import { KEYS } from './keys';
import { RegistrationData, ResultProps } from '../types/interfaces';

export const countryId = {
  Spain: 'ES',
  France: 'FR',
  Italy: 'IT',
  Germany: 'DE',
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
    const billingKey = data.billingAddress.country as keyof typeof countryId;
    const shippingKey = data.shippingAddress.country as keyof typeof countryId;

    const adaptedData = { ...data };
    adaptedData.billingAddress = { ...data.billingAddress };
    adaptedData.shippingAddress = { ...data.shippingAddress };

    adaptedData.billingAddress.country = countryId[billingKey] || data.billingAddress.country;
    adaptedData.shippingAddress.country = countryId[shippingKey] || data.shippingAddress.country;

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
            country: data.billingAddress.country,
            city: data.billingAddress.city,
            streetName: data.billingAddress.street,
            postalCode: data.billingAddress.postalCode,
          },
          {
            country: data.shippingAddress.country,
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
