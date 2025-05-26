import { Product, ProductCardProps } from '../../../types/interfaces';

export default function toCardAdapter(product: Product): ProductCardProps {
  const variant = product.masterVariant;
  const priceData = variant.prices[0];
  const originalPrice = priceData?.value.centAmount / 100 || 0;
  const discountedPrice = priceData?.discounted?.value?.centAmount
    ? priceData.discounted.value.centAmount / 100
    : undefined;
  const isOnSale = !!priceData?.discounted;
  const price = discountedPrice || originalPrice;
  const imageUrl = variant.images[0]?.url || '';
  const name = product.name['en-US'] || '';
  const description = product.description?.['en-US'] || '';

  const packagingCategory = product.categories.find(cat =>
    cat.obj?.name?.['en-US']?.toLowerCase().includes('pack')
  );

  let category = '';
  if (packagingCategory?.obj?.name?.['en-US']) {
    const categoryName = packagingCategory.obj.name['en-US'];
    if (['6-pack', '12-pack', '24-pack'].includes(categoryName)) {
      category = categoryName;
    }
  }

  const slug = product.slug['en-US'];
  const isBestSellerAttr = variant.attributes.find(attribute => attribute.name === 'isBestSeller');

  let isBestSeller = false;
  if (isBestSellerAttr) {
    const value = isBestSellerAttr.value;
    if (typeof value === 'boolean') {
      isBestSeller = value;
    } else if (typeof value === 'string') {
      isBestSeller = value === 'true';
    } else if (typeof value === 'object' && 'key' in value) {
      isBestSeller = value.key === 'true';
    }
  }

  const filters = { isBestSeller };

  return {
    id: product.id,
    name,
    description,
    price,
    originalPrice: isOnSale ? originalPrice : undefined,
    isOnSale,
    imageUrl,
    category,
    slug,
    filters,
  };
}
