import { BillingAddressModal, ShippingAddressModal } from '../schemas/aditAddressSchema';
import { Customer, CustomerInfo, TokenResponse } from '../types/interfaces';
import handleLogin from './handleLogin';
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

    // Обновляем данные пользователя в localStorage, включая версию
    localStorage.setItem(
      'user',
      JSON.stringify({
        ...user,
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
    throw new Error('Error fetching customer data:' + error);
  }
}

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
    // Формируем тело запроса
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

      // Обновляем данные пользователя в localStorage вместе с версией
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

async function addAddress(
  actions: {
    action: string;
    address: {
      streetName: string;
      postalCode: string;
      city: string;
      country: string;
    };
  }[],
  actionAddId: string,
  actionAddDefaultId?: string
) {
  const tokenData = JSON.parse(localStorage.getItem('token') || '{}') as TokenResponse;
  const accessToken = tokenData.access_token;
  const user = JSON.parse(localStorage.getItem('user') || '{}') as CustomerInfo;
  const id = user.id;
  if (!accessToken || !id) {
    throw new Error('Authentication data is missing');
  }

  const url = `${KEYS.API_URL}/${KEYS.PROJECT_KEY}/customers/${id}`;
  const requestBody = {
    version: user.version,
    actions: actions,
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
    const newAddressId = data.addresses[data.addresses.length - 1].id;
    console.log(actionAddId);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: data.version,
          actions: [
            {
              action: actionAddId,
              addressId: newAddressId,
            },
          ],
        }),
      });
      const addedAddressResponse = await response.json();
      localStorage.setItem('login', JSON.stringify(addedAddressResponse));
    } catch (error) {
      throw new Error(`Error addAddressId customer with version ${data.version}: ${error}`);
    }
    if (actionAddDefaultId) {
      try {
        const customer = await getCustomer();
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            version: customer.version,
            actions: [
              {
                action: actionAddDefaultId,
                addressId: newAddressId,
              },
            ],
          }),
        });
        const addDefaultResponse = await response.json();
        localStorage.setItem('login', JSON.stringify(addDefaultResponse));
      } catch (error) {
        throw new Error(`Error update customer with version ${data.version}: ${error}`);
      }
    }
  } catch (error) {
    throw new Error(`Error updating customer with version ${user.version}: ${error}`);
  }
}
export async function AddBillingAddress(addressData: BillingAddressModal) {
  const actions = [
    {
      action: 'addAddress',
      address: {
        streetName: addressData.billing_street,
        postalCode: addressData.billing_postalCode,
        city: addressData.billing_city,
        country: addressData.billing_country,
      },
    },
  ];
  try {
    if (addressData.billing_isDefault)
      await addAddress(actions, 'addBillingAddressId', 'setDefaultBillingAddress');
    else await addAddress(actions, 'addBillingAddressId');
  } catch (err) {
    throw new Error(`Error adding billing address: ${err}`);
  }
}

export async function AddShippingAddress(addressData: ShippingAddressModal) {
  const actions = [
    {
      action: 'addAddress',
      address: {
        streetName: addressData.shipping_street,
        postalCode: addressData.shipping_postalCode,
        city: addressData.shipping_city,
        country: addressData.shipping_country,
      },
    },
  ];
  try {
    if (addressData.shipping_isDefault)
      await addAddress(actions, 'addShippingAddressId', 'setDefaultShippingAddress');
    else await addAddress(actions, 'addShippingAddressId');
  } catch (err) {
    throw new Error(`Error adding shipping address: ${err}`);
  }
}
export async function deleteAddress(addressId: string) {
  const tokenData = JSON.parse(localStorage.getItem('token') || '{}') as TokenResponse;
  const accessToken = tokenData.access_token;
  if (!accessToken) {
    throw new Error('Authentication data is missing');
  }
  try {
    const user = await getCustomer();

    const id = user.id;
    const url = `${KEYS.API_URL}/${KEYS.PROJECT_KEY}/customers/${id}`;
    const requestBody = {
      version: user.version,
      actions: [
        {
          action: 'removeAddress',
          addressId: addressId,
        },
      ],
    };
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    const deletedAddressResponse = await response.json();
    localStorage.setItem('login', JSON.stringify(deletedAddressResponse));
  } catch (err) {
    throw new Error(`Error removing address: ${err}`);
  }
}
export async function EditAddress(
  addressId: string,
  requestAddress: {
    streetName: string;
    postalCode: string;
    city: string;
    country: string;
  },
  type: string,
  defaultAddress: boolean
) {
  const tokenData = JSON.parse(localStorage.getItem('token') || '{}') as TokenResponse;
  const accessToken = tokenData.access_token;
  if (!accessToken) {
    throw new Error('Authentication data is missing');
  }
  try {
    const user = await getCustomer();

    const id = user.id;
    const url = `${KEYS.API_URL}/${KEYS.PROJECT_KEY}/customers/${id}`;
    const requestBody = {
      version: user.version,
      actions: [
        {
          action: 'changeAddress',
          addressId: addressId,
          address: requestAddress,
        },
      ],
    };
    const setDefault: {
      action: string;
      addressId: string | undefined;
    } =
      type === 'billing'
        ? {
            action: 'setDefaultBillingAddress',
            addressId: addressId,
          }
        : {
            action: 'setDefaultShippingAddress',
            addressId: addressId,
          };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const editedAddressResponse = await response.json();
    localStorage.setItem('login', JSON.stringify(editedAddressResponse));
    if (
      defaultAddress ||
      (!defaultAddress &&
        (editedAddressResponse.defaultBillingAddressId === addressId ||
          editedAddressResponse.defaultShippingAddressId === addressId))
    ) {
      if (
        !defaultAddress &&
        (editedAddressResponse.defaultBillingAddressId === addressId ||
          editedAddressResponse.defaultShippingAddressId === addressId)
      ) {
        setDefault.addressId = undefined;
      }
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            version: editedAddressResponse.version,
            actions: [setDefault],
          }),
        });
        const addedDefaultResponse = await response.json();
        localStorage.setItem('login', JSON.stringify(addedDefaultResponse));
      } catch (err) {
        throw new Error(`Error adding default address: ${err}`);
      }
    }
  } catch (err) {
    throw new Error(`Error editing address: ${err}`);
  }
}
export async function EditBillingAddress(addressId: string, data: BillingAddressModal) {
  const requestAddress = {
    streetName: data.billing_street,
    postalCode: data.billing_postalCode,
    city: data.billing_city,
    country: data.billing_country,
  };
  try {
    await EditAddress(addressId, requestAddress, 'billing', data.billing_isDefault);
  } catch {
    throw new Error(`Error editing billing address`);
  }
}
export async function EditShippingAddress(addressId: string, data: ShippingAddressModal) {
  const requestAddress = {
    streetName: data.shipping_street,
    postalCode: data.shipping_postalCode,
    city: data.shipping_city,
    country: data.shipping_country,
  };
  try {
    await EditAddress(addressId, requestAddress, 'shipping', data.shipping_isDefault);
  } catch {
    throw new Error(`Error editing shipping address`);
  }
}
