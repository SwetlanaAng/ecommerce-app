import { getBasicToken } from './registration.service';
import { Product } from '../types/interfaces';
import { KEYS } from './keys';

export async function getProducts(): Promise<Product[]> {
  const accessToken = await getBasicToken();

  try {
    const response = await fetch(
      `${KEYS.API_URL}/${KEYS.PROJECT_KEY}/products?limit=20&expand=categories[*]`,
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
    console.log('API Response:', data);
    return data.results;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

export async function getProductById(id: string): Promise<Product[]> {
  const accessToken = await getBasicToken();

  try {
    const response = await fetch(`${KEYS.API_URL}/${KEYS.PROJECT_KEY}/product-projections/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}
