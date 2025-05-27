import { getBasicToken } from './registration.service';
import { KEYS } from './keys';
import { ProductFilters, Product } from '../types/interfaces';

export type SortOption = '' | 'name.en-US asc' | 'name.en-US desc' | 'price asc' | 'price desc';

const buildFilterPredicates = (filters?: ProductFilters): string[] => {
  const predicates: string[] = [];

  if (filters) {
    if (filters.priceRange) {
      if (filters.priceRange.min !== undefined) {
        predicates.push(`variants.price.centAmount:range(${filters.priceRange.min * 100} to *)`);
      }
      if (filters.priceRange.max !== undefined) {
        predicates.push(`variants.price.centAmount:range(* to ${filters.priceRange.max * 100})`);
      }
    }

    if (filters.flavors && filters.flavors.length > 0) {
      predicates.push(`variants.attributes.flavors.key:"${filters.flavors[0]}"`);
    }

    if (filters.isBestSeller === true) {
      predicates.push(`variants.attributes.isBestSeller:true`);
    }

    if (filters.categoryId) {
      predicates.push(`categories.id:"${filters.categoryId}"`);
    }
  }

  return predicates;
};

export async function getProductsList(
  limit: number = 20,
  offset: string = '',
  sort: SortOption = '',
  filters?: ProductFilters
): Promise<Product[]> {
  const accessToken = await getBasicToken();

  try {
    let url = `${KEYS.API_URL}/${KEYS.PROJECT_KEY}/product-projections/search?limit=${limit}`;

    if (sort) {
      url += `&sort=${sort}`;
    }

    const predicates = buildFilterPredicates(filters);

    if (predicates.length > 0) {
      predicates.forEach(predicate => {
        url += `&filter=${encodeURIComponent(predicate)}`;
      });
    }

    if (offset) {
      url += `&offset=${offset}`;
    }

    url += '&expand=categories[*]';

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
    console.error('Error fetching products:', error);
    throw error;
  }
}

export async function searchProducts(
  query: string,
  filters?: ProductFilters,
  sort: SortOption = ''
): Promise<Product[]> {
  const accessToken = await getBasicToken();

  try {
    let fuzzyLevel = 0;
    if (query.length > 5) {
      fuzzyLevel = 2;
    } else if (query.length >= 3) {
      fuzzyLevel = 1;
    }

    let url = `${KEYS.API_URL}/${KEYS.PROJECT_KEY}/product-projections/search?text.en-US=${encodeURIComponent(`*${query}*`)}&fuzzy=true&fuzzyLevel=${fuzzyLevel}`;

    if (sort) {
      url += `&sort=${sort}`;
    }

    const predicates = buildFilterPredicates(filters);

    if (predicates.length > 0) {
      predicates.forEach(predicate => {
        url += `&filter=${encodeURIComponent(predicate)}`;
      });
    }

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
    console.error('Error searching products:', error);
    throw error;
  }
}

export async function getProductFlavors(): Promise<string[]> {
  const accessToken = await getBasicToken();

  try {
    const url = `${KEYS.API_URL}/${KEYS.PROJECT_KEY}/product-projections/search?limit=500`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const flavorsSet = new Set<string>();

    if (data.results && data.results.length > 0) {
      data.results.forEach((product: Product) => {
        if (product.masterVariant && product.masterVariant.attributes) {
          const flavorAttribute = product.masterVariant.attributes.find(
            attr => attr.name === 'flavors'
          );
          if (flavorAttribute && flavorAttribute.value) {
            if (typeof flavorAttribute.value === 'object' && 'key' in flavorAttribute.value) {
              flavorsSet.add(flavorAttribute.value.key);
            } else if (typeof flavorAttribute.value === 'string') {
              flavorsSet.add(flavorAttribute.value);
            }
          }
        }
      });
    }

    return Array.from(flavorsSet);
  } catch (error) {
    console.error('Error fetching flavors:', error);
    return [];
  }
}

export async function getPriceRange(): Promise<{ min: number; max: number }> {
  const accessToken = await getBasicToken();

  try {
    const url = `${KEYS.API_URL}/${KEYS.PROJECT_KEY}/product-projections/search?facet=variants.price.centAmount:range(0 to *)`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    let min = 0;
    let max = 1000;

    if (data.facets && data.facets['variants.price.centAmount']) {
      const ranges = data.facets['variants.price.centAmount'].ranges;
      if (ranges && ranges.length > 0) {
        min = Math.floor(ranges[0].min / 100);
        max = Math.ceil(ranges[ranges.length - 1].max / 100);
      }
    }

    return { min, max };
  } catch (error) {
    console.error('Error fetching price range:', error);
    return { min: 0, max: 1000 };
  }
}
