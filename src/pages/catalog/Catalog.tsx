import React from 'react';
import ProductCard from '../../components/product/ProductCard';
import { Product } from '../../types/interfaces';
import './Catalog.css';

// Временные данные для демонстрации
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Classic White T-Shirt',
    description: 'A comfortable and stylish white t-shirt made from 100% cotton.',
    price: 29.99,
    imageUrl: 'https://placehold.co/300x400',
    category: 'Clothing',
  },
  {
    id: '2',
    name: 'Blue Jeans',
    description: 'Classic blue jeans with a modern fit.',
    price: 59.99,
    imageUrl: 'https://placehold.co/300x400',
    category: 'Clothing',
  },
  {
    id: '3',
    name: 'Running Shoes',
    description: 'Lightweight running shoes for maximum comfort.',
    price: 89.99,
    imageUrl: 'https://placehold.co/300x400',
    category: 'Footwear',
  },
  {
    id: '4',
    name: 'Leather Wallet',
    description: 'Genuine leather wallet with multiple card slots.',
    price: 39.99,
    imageUrl: 'https://placehold.co/300x400',
    category: 'Accessories',
  },
];

const Catalog: React.FC = () => {
  return (
    <div className="catalog-page">
      <h1>Product Catalog</h1>
      <div className="catalog-grid">
        {mockProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Catalog;
