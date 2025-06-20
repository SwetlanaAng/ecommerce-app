import { Product } from '../types/interfaces';
import { getProductsData } from './local-data.service';

export async function getProducts(): Promise<Product[]> {
  try {
    const allProducts = getProductsData();
    return allProducts.slice(0, 20);
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

export async function getProductById(id: string): Promise<Product> {
  try {
    const allProducts = getProductsData();
    const product = allProducts.find(p => p.id === id);

    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }

    return product;
  } catch (error) {
    console.error('Error fetching product by id:', error);
    throw error;
  }
}

export async function getProductBySlug(slug: string): Promise<Product> {
  try {
    const allProducts = getProductsData();
    const product = allProducts.find(p => p.slug['en-US'] === slug);

    if (!product) {
      throw new Error(`Product with slug ${slug} not found`);
    }

    return product;
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    throw error;
  }
}
