import { Customer, CustomerInfo, TokenResponse } from '../types/interfaces';
import { KEYS } from './keys';

export async function getCustomer(): Promise<CustomerInfo> {
  const tokenData = JSON.parse(localStorage.getItem('token') || '{}') as TokenResponse;
  const accessToken = tokenData.access_token;
  const user = JSON.parse(localStorage.getItem('user') || '{}') as Customer;
  const id = user.id;
  if (!accessToken || !id) {
    throw new Error('Authentication data is missing');
  }
  const url = `${KEYS.API_URL}/${KEYS.PROJECT_KEY}/customers/${id}`;
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      id: data.id,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password,
      addresses: data.addresses,
      shippingAddressIds: data.shippingAddressIds,
      billingAddressIds: data.billingAddressIds,
      dateOfBirth: data.dateOfBirth,
      defaultBillingAddressId: data.defaultBillingAddressId,
      defaultShippingAddressId: data.defaultShippingAddressId,
    };
  } catch (error) {
    throw new Error('Error fetching customer data:' + error);
  }
}
