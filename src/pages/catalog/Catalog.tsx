import React, { useEffect, useState } from 'react';
import ProductCard from '../../components/product/ProductCard';
import { Product, ProductCardProps } from '../../types/interfaces';
import { getProductsList, cardsPerPage } from '../../services/products.service';
import toCardAdapter from '../../lib/utils/productDataAdapters/toCardAdapter';
import SkeletonCard from '../../components/skeleton/SkeletonCard';
import './Catalog.css';

const Catalog: React.FC = () => {
  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const updateProducts = async () => {
    setLoading(true);
    try {
      const productsList: Product[] | undefined = await getProductsList(cardsPerPage.catalog);

      if (productsList) {
        const adaptedProducts = await Promise.all(
          productsList.map(product => toCardAdapter(product))
        );
        setProducts(adaptedProducts);
      } else {
        setError('Failed to load products');
      }
    } catch (err) {
      setError('Error loading products.' + err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    updateProducts();
  }, []);

  if (error) {
    return (
      <div className="catalog-page">
        <h1>Product Catalog</h1>
        <p>Error loading products, please try again later.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="catalog-page">
        <h1>Product Catalog</h1>
        <div className="catalog-flex">
          {[...Array(8)].map((_, index) => (
            <SkeletonCard key={index} count={1} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="catalog-page">
      <h1>Product Catalog</h1>
      <div className="catalog-flex">
        {products.length === 0 ? (
          <p>No products to show...</p>
        ) : (
          products.map((product, index) => <ProductCard {...product} key={index} />)
        )}
      </div>
    </div>
  );
};

export default Catalog;
