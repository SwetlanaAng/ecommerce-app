import { Product, ProductCardProps } from '../../../types/interfaces';

export default function toCardAdapter(product: Product): ProductCardProps {
  const price = product.masterVariant.prices[0]?.value.centAmount / 100 || 0;
  const imageUrl = product.masterVariant.images[0]?.url || '';
  const name = product.name['en-US'] || '';
  const description = product.description?.['en-US'] || '';
  const category = product.categories[0]?.id || '';

  return {
    id: product.id,
    name,
    description,
    price,
    imageUrl,
    category,
  };
}
