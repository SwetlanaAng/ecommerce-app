import { BillingAddressModal, ShippingAddressModal } from '../schemas/aditAddressSchema';
import { CustomerInfo, TokenResponse } from '../types/interfaces';
import { KEYS } from './keys';
import { getCustomer } from './profile.service';

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
