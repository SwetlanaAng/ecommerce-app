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
    return data.results;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

export async function getProductById(id: string): Promise<Product> {
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

export async function getProductBySlug(slug: string): Promise<Product> {
  const accessToken = await getBasicToken();

  try {
    const encodedSlug = encodeURIComponent(`slug(en-US="${slug}")`);
    const url = `${KEYS.API_URL}/${KEYS.PROJECT_KEY}/product-projections?where=${encodedSlug}&limit=1`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.results.length === 0) {
      throw new Error('No product found with the given slug.');
    }

    return data.results[0];
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    throw error;
  }
}
