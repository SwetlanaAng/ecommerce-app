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
    console.error('Error building category map:', error);
    return new Map<string, string>();
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
    const categoryMap = await buildCategoryNameToIdMap();

    for (const [category, values] of Object.entries(filters)) {
      if (category === 'priceRange') continue;

      if (Array.isArray(values) && values.length > 0) {
        const filterQueries = values
          .map(value => {
            const categoryId = categoryMap.get(value.toLowerCase());
            if (categoryId) {
              return `categories.id:"${categoryId}"`;
            }
            return null;
          })
          .filter(Boolean);

        if (filterQueries.length > 0) {
          params.append('filter', filterQueries.join(' or '));
        }
      }
    }

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
