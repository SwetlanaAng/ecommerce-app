import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';

const projectKey = 'gitinitshop';

const getToken = async () => {
  const authUrl = 'https://auth.us-east-2.aws.commercetools.com';
  const clientId = 'xretPewcCVqHa-D-478PaIQ3';
  const clientSecret = 'Z-bbHsxBGYarShxah3q7deHpa4zZeM0x';

  const response = await fetch(
    `${authUrl}/oauth/token?grant_type=client_credentials&scope=manage_customers:gitinitshop`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to get access token');
  }

  return response.json();
};

// Функция для создания клиента API
export const createApiClient = async () => {
  try {
    const tokenData = await getToken();

    const ctpClient = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      execute: async (request: any) => {
        const response = await fetch(`https://api.us-east-2.aws.commercetools.com${request.uri}`, {
          method: request.method,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenData.access_token}`,
          },
          body: request.body ? JSON.stringify(request.body) : undefined,
        });

        const data = await response.json();
        return { body: data, statusCode: response.status };
      },
    };

    return createApiBuilderFromCtpClient(ctpClient).withProjectKey({ projectKey });
  } catch (error) {
    console.error('Error creating API client:', error);
    throw error;
  }
};

// Функция для создания покупателя
export const createCustomer = async () => {
  try {
    const apiRoot = await createApiClient();

    const customerDraft = {
      email: 'test2@example.com',
      password: 'StrongPassword1234',
      firstName: 'Test2',
      lastName: 'User',
    };

    const response = await apiRoot.customers().post({ body: customerDraft }).execute();

    console.log('Покупатель создан:', response.body);
    return response.body;
  } catch (error) {
    console.error('Ошибка при создании покупателя:', error);
    throw error;
  }
};
