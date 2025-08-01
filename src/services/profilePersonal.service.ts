import { Customer, CustomerInfo, TokenResponse } from '../types/interfaces';
import handleLogin from './handleLogin';
import { KEYS } from './keys';
import { getCustomer } from './profile.service';

export async function updateCustomerProfile(personalData: {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
}): Promise<CustomerInfo> {
  const tokenData = JSON.parse(localStorage.getItem('token') || '{}') as TokenResponse;
  const accessToken = tokenData.access_token;
  const user = JSON.parse(localStorage.getItem('user') || '{}') as Customer;
  const id = user.id;

  if (!accessToken || !id) {
    throw new Error('Authentication data is missing');
  }

  const url = `${KEYS.API_URL}/${KEYS.PROJECT_KEY}/customers/${id}`;

  async function updateWithVersion(version: number): Promise<CustomerInfo> {
    const requestBody = {
      version: version,
      actions: [
        {
          action: 'setFirstName',
          firstName: personalData.firstName,
        },
        {
          action: 'setLastName',
          lastName: personalData.lastName,
        },
        {
          action: 'changeEmail',
          email: personalData.email,
        },
        {
          action: 'setDateOfBirth',
          dateOfBirth: personalData.dateOfBirth,
        },
      ],
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      localStorage.setItem(
        'user',
        JSON.stringify({
          ...user,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          version: data.version,
        })
      );
      localStorage.setItem('login', JSON.stringify(data));

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
        version: data.version,
      };
    } catch (error) {
      throw new Error(`Error updating customer with version ${version}: ${error}`);
    }
  }

  try {
    const currentCustomer = await getCustomer();
    return await updateWithVersion(currentCustomer.version || 1);
  } catch (error) {
    throw new Error('Error updating customer profile: ' + error);
  }
}

export async function ChangePassword(passwordData: {
  currentPassword: string;
  newPassword: string;
}): Promise<CustomerInfo> {
  const tokenData = JSON.parse(localStorage.getItem('token') || '{}') as TokenResponse;
  const accessToken = tokenData.access_token;
  const user = JSON.parse(localStorage.getItem('user') || '{}') as CustomerInfo;
  const id = user.id;
  if (!accessToken || !id) {
    throw new Error('Authentication data is missing');
  }

  const url = `${KEYS.API_URL}/${KEYS.PROJECT_KEY}/customers/password`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
        version: user.version,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    localStorage.setItem(
      'user',
      JSON.stringify({
        ...user,
        version: data.version,
      })
    );
    localStorage.setItem('login', JSON.stringify(data));

    handleLogin(user.email, passwordData.newPassword);

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
      version: data.version,
    };
  } catch (error) {
    throw new Error(`Error updating customer with version ${user.version}: ${error}`);
  }
}
