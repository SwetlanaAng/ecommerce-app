import { getBasicToken } from './registration.service';
import { KEYS } from './keys';

export enum cardsPerPage {
  home = 6,
  catalog = 21,
}

export async function getProductsList(limit?: number, searchQuery?: string) {
  const accessToken = await getBasicToken();
  const params = new URLSearchParams();

  if (limit) {
    params.append('limit', limit.toString());
  }

  if (searchQuery) {
    params.append('text.en-US', searchQuery);
  }

  try {
    const response = await fetch(
      `${KEYS.API_URL}/${KEYS.PROJECT_KEY}/product-projections/search?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    throw new Error('Error fetching products:' + error);
  }
}
