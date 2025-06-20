import productsData from '../../commercetools-export/products.json';
import categoriesData from '../../commercetools-export/categories.json';
import discountCodesData from '../../commercetools-export/discount-codes.json';
import cartDiscountsData from '../../commercetools-export/cart-discounts.json';
import {
  Product,
  CategoryData,
  DiscountCode,
  CartDiscount,
  CommercetoolsProduct,
  CommercetoolsCategory,
} from '../types/interfaces';

let productsCache: Product[] | null = null;
let categoriesCache: CategoryData[] | null = null;
let discountCodesCache: DiscountCode[] | null = null;
let cartDiscountsCache: CartDiscount[] | null = null;

function transformProductToAppFormat(ctProduct: CommercetoolsProduct): Product {
  const { current, hasStagedChanges, published } = ctProduct.masterData;
  const { masterVariant } = current;

  return {
    id: ctProduct.id,
    version: ctProduct.version,
    key: ctProduct.key,
    productType: {
      typeId: 'product-type',
      id: ctProduct.productType.id,
    },
    name: current.name,
    description: current.description,
    slug: current.slug,
    categories: current.categories.map(cat => ({
      typeId: cat.typeId,
      id: cat.id,
    })),
    masterVariant: {
      id: masterVariant.id,
      prices: masterVariant.prices,
      images: masterVariant.images,
      attributes: masterVariant.attributes,
    },
    searchKeywords: current.searchKeywords as { en: [{ text: string }] },
    hasStagedChanges,
    published,
    taxCategory: ctProduct.taxCategory,
    priceMode: 'Embedded',
    createdAt: ctProduct.createdAt,
    lastModifiedAt: ctProduct.lastModifiedAt,
  };
}

function transformCategoryToAppFormat(ctCategory: CommercetoolsCategory): CategoryData {
  return {
    id: ctCategory.id,
    name: ctCategory.name,
    parent: ctCategory.parent,
  };
}

export function getProductsData(): Product[] {
  if (!productsCache) {
    productsCache = (productsData as unknown as CommercetoolsProduct[]).map(
      transformProductToAppFormat
    );
  }
  return productsCache;
}

export function getCategoriesData(): CategoryData[] {
  if (!categoriesCache) {
    categoriesCache = (categoriesData as unknown as CommercetoolsCategory[]).map(
      transformCategoryToAppFormat
    );
  }
  return categoriesCache;
}

export function getDiscountCodesData(): DiscountCode[] {
  if (!discountCodesCache) {
    discountCodesCache = discountCodesData as unknown as DiscountCode[];
  }
  return discountCodesCache;
}

export function getCartDiscountsData(): CartDiscount[] {
  if (!cartDiscountsCache) {
    cartDiscountsCache = cartDiscountsData as CartDiscount[];
  }
  return cartDiscountsCache;
}
