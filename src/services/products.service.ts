import { getBasicToken } from './registration.service';
import { KEYS } from './keys';
import { CategoryData, ProductFilters } from '../types/interfaces';
import { getCategories } from './category.service';

export enum cardsPerPage {
  home = 6,
  catalog = 21,
}

export type SortOption = 'name.en-US asc' | 'name.en-US desc' | 'price asc' | 'price desc' | '';

let categoryNameToIdMap: Map<string, string> | null = null;

async function buildCategoryNameToIdMap() {
  if (categoryNameToIdMap) return categoryNameToIdMap;

  try {
    const categories = await getCategories();
    const map = new Map<string, string>();

    categories.forEach((category: CategoryData) => {
      const categoryName = category.name['en-US'];
      map.set(categoryName.toLowerCase(), category.id);
    });

    categoryNameToIdMap = map;
    return map;
  } catch (error) {
    throw new Error(
      `Failed to build category mapping: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export async function getProductsList(
  limit?: number,
  searchQuery?: string,
  sort?: SortOption,
  filters?: ProductFilters
) {
  const accessToken = await getBasicToken();
  const params = new URLSearchParams();

  if (limit) {
    params.append('limit', limit.toString());
  }

  if (searchQuery) {
    params.append('text.en-US', searchQuery);
  }

  if (sort) {
    params.append('sort', sort);
  }

  if (filters) {
    try {
      const categoryMap = await buildCategoryNameToIdMap();
      const categoryFilters = [];

      for (const [category, values] of Object.entries(filters)) {
        if (category === 'priceRange') continue;

        if (Array.isArray(values) && values.length > 0) {
          const categoryIds = values
            .map(value => {
              const categoryId = categoryMap.get(value.toLowerCase());
              return categoryId ? `"${categoryId}"` : null;
            })
            .filter(Boolean);

          if (categoryIds.length > 0) {
            categoryFilters.push(`categories.id:${categoryIds.join(',')}`);
          }
        }
      }

      categoryFilters.forEach(filter => {
        params.append('filter', filter);
      });

      if (filters.priceRange) {
        if (filters.priceRange.min !== undefined) {
          params.append(
            'filter',
            `variants.price.centAmount:range (${filters.priceRange.min * 100} to *)`
          );
        }
        if (filters.priceRange.max !== undefined) {
          params.append(
            'filter',
            `variants.price.centAmount:range (* to ${filters.priceRange.max * 100})`
          );
        }
      }
    } catch (error) {
      throw new Error(
        `Error applying filters: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  const url = `${KEYS.API_URL}/${KEYS.PROJECT_KEY}/product-projections/search?${params.toString()}`;

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
    return data.results;
  } catch (error) {
    throw new Error(
      `Error fetching products: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export async function searchProducts(inputProductName: string) {
  if (inputProductName === '') {
    return await getProductsList();
  }

  const accessToken = await getBasicToken();
  try {
    const params = new URLSearchParams();

    params.append('fuzzy', 'true');
    params.append('text.en-US', inputProductName);

    const searchLength = inputProductName.length;
    let fuzzyLevel = '0';

    if (searchLength >= 3 && searchLength <= 5) {
      fuzzyLevel = '1';
    } else if (searchLength > 5) {
      fuzzyLevel = '2';
    }

    params.append('fuzzyLevel', fuzzyLevel);

    const url = `${KEYS.API_URL}/${KEYS.PROJECT_KEY}/product-projections/search?${params.toString()}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error in searchProducts:', error);
    return undefined;
  }
}
