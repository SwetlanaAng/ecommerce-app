import { getBasicToken } from './registration.service';
import { KEYS } from './keys';

export async function getCategories() {
  const accessToken = await getBasicToken();
  const response = await fetch(`${KEYS.API_URL}/${KEYS.PROJECT_KEY}/categories/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) {
    return undefined;
  }
  const data = await response.json();
  return data.results;
}
