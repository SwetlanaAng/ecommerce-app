import { KEYS } from './keys';

export const getCustomerToken = async (loginData: { email: string; password: string }) => {
  const params = new URLSearchParams();
  params.append('grant_type', 'password');
  params.append('username', loginData.email);
  params.append('password', loginData.password);
  params.append('scope', `manage_customers:${KEYS.PROJECT_KEY}`);

  const response = await fetch(`${KEYS.AUTH_URL}/oauth/${KEYS.PROJECT_KEY}/customers/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${btoa(`${KEYS.CLIENT_ID}:${KEYS.CLIENT_SECRET}`)}`,
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to get customer token: ${errorText}`);
  }

  return response.json();
};
