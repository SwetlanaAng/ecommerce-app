import { ProductFilters, Product } from '../types/interfaces';
import { getProductsData } from './local-data.service';

export type SortOption = '' | 'name.en-US asc' | 'name.en-US desc' | 'price asc' | 'price desc';

function filterByPriceRange(
  product: Product,
  priceRange?: { min?: number; max?: number }
): boolean {
  if (!priceRange) return true;

  const price = product.masterVariant.prices[0]?.value.centAmount / 100;

  if (priceRange.min !== undefined && price < priceRange.min) return false;
  if (priceRange.max !== undefined && price > priceRange.max) return false;

  return true;
}

function filterByFlavors(product: Product, flavors?: string[]): boolean {
  if (!flavors || flavors.length === 0) return true;

  const productFlavor = product.masterVariant.attributes?.find(attr => attr.name === 'flavors');
  if (!productFlavor) return false;

  let flavorKey: string | undefined;

  if (
    typeof productFlavor.value === 'object' &&
    productFlavor.value &&
    'key' in productFlavor.value
  ) {
    flavorKey = productFlavor.value.key;
  } else if (typeof productFlavor.value === 'string') {
    flavorKey = productFlavor.value;
  }

  if (flavorKey) {
    return flavors.includes(flavorKey);
  }

  return false;
}

function filterByAttributes(product: Product, filters?: ProductFilters): boolean {
  if (!filters) return true;

  if (filters.categoryId) {
    const hasCategory = product.categories.some(cat => cat.id === filters.categoryId);
    if (!hasCategory) return false;
  }

  const bestSellerFilterOn = filters.isBestSeller === true;
  const glutenFreeFilterOn = filters.isGlutenFree === true;

  if (!bestSellerFilterOn && !glutenFreeFilterOn) {
    return true;
  }

  const productIsBestSeller =
    product.masterVariant.attributes?.some(
      attr => attr.name === 'isBestSeller' && attr.value === true
    ) || false;
  const productIsGlutenFree =
    product.masterVariant.attributes?.some(
      attr => attr.name === 'isGlutenFree' && attr.value === true
    ) || false;

  if (bestSellerFilterOn && glutenFreeFilterOn) {
    return productIsBestSeller || productIsGlutenFree;
  }

  if (bestSellerFilterOn) {
    return productIsBestSeller;
  }

  if (glutenFreeFilterOn) {
    return productIsGlutenFree;
  }

  return true;
}

function searchInProduct(product: Product, query: string): boolean {
  if (!query) return true;

  const searchText = query.toLowerCase();
  const name = product.name['en-US']?.toLowerCase() || '';
  const description = product.description?.['en-US']?.toLowerCase() || '';

  return name.includes(searchText) || description.includes(searchText);
}

function sortProducts(products: Product[], sort: SortOption): Product[] {
  const sortedProducts = [...products];

  switch (sort) {
    case 'name.en-US asc':
      return sortedProducts.sort((a, b) =>
        (a.name['en-US'] || '').localeCompare(b.name['en-US'] || '')
      );
    case 'name.en-US desc':
      return sortedProducts.sort((a, b) =>
        (b.name['en-US'] || '').localeCompare(a.name['en-US'] || '')
      );
    case 'price asc':
      return sortedProducts.sort((a, b) => {
        const priceA = a.masterVariant.prices[0]?.value.centAmount || 0;
        const priceB = b.masterVariant.prices[0]?.value.centAmount || 0;
        return priceA - priceB;
      });
    case 'price desc':
      return sortedProducts.sort((a, b) => {
        const priceA = a.masterVariant.prices[0]?.value.centAmount || 0;
        const priceB = b.masterVariant.prices[0]?.value.centAmount || 0;
        return priceB - priceA;
      });
    default:
      return sortedProducts;
  }
}

function paginateProducts(products: Product[], limit: number, offset: string): Product[] {
  const offsetNum = parseInt(offset) || 0;
  return products.slice(offsetNum, offsetNum + limit);
}

export async function getProductsList(
  limit: number = 20,
  offset: string = '',
  sort: SortOption = '',
  filters?: ProductFilters
): Promise<Product[]> {
  try {
    const allProducts = getProductsData();
    let filteredProducts = allProducts.filter(product => {
      return (
        filterByPriceRange(product, filters?.priceRange) &&
        filterByFlavors(product, filters?.flavors) &&
        filterByAttributes(product, filters)
      );
    });

    filteredProducts = sortProducts(filteredProducts, sort);

    return paginateProducts(filteredProducts, limit, offset);
  } catch (error) {
    console.error('Error getting products list:', error);
    throw error;
  }
}

export async function searchProducts(
  query: string,
  filters?: ProductFilters,
  sort: SortOption = ''
): Promise<Product[]> {
  try {
    const allProducts = getProductsData();
    const filteredProducts = allProducts.filter(product => {
      return (
        searchInProduct(product, query) &&
        filterByPriceRange(product, filters?.priceRange) &&
        filterByFlavors(product, filters?.flavors) &&
        filterByAttributes(product, filters)
      );
    });

    return sortProducts(filteredProducts, sort);
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
}

export async function getProductFlavors(): Promise<string[]> {
  try {
    const allProducts = getProductsData();
    const flavorsSet = new Set<string>();

    allProducts.forEach(product => {
      const flavorAttribute = product.masterVariant.attributes?.find(
        attr => attr.name === 'flavors'
      );
      if (flavorAttribute && flavorAttribute.value) {
        if (typeof flavorAttribute.value === 'object' && 'key' in flavorAttribute.value) {
          flavorsSet.add(flavorAttribute.value.key);
        } else if (typeof flavorAttribute.value === 'string') {
          flavorsSet.add(flavorAttribute.value);
        }
      }
    });

    return Array.from(flavorsSet);
  } catch (error) {
    console.error('Error getting product flavors:', error);
    return [];
  }
}

export async function getPriceRange(): Promise<{ min: number; max: number }> {
  try {
    const allProducts = getProductsData();
    const prices = allProducts
      .map(product => product.masterVariant.prices[0]?.value.centAmount / 100)
      .filter(price => price !== undefined && !isNaN(price));

    if (prices.length === 0) {
      return { min: 0, max: 1000 };
    }

    const min = Math.floor(Math.min(...prices));
    const max = Math.ceil(Math.max(...prices));

    return { min, max };
  } catch (error) {
    console.error('Error getting price range:', error);
    return { min: 0, max: 1000 };
  }
}
