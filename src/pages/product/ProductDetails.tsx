import React, { useEffect, useState } from 'react';
import { Product } from '../../types/interfaces';
import { useParams } from 'react-router-dom';
import { getProductById } from '../../services/product.service';
import ProductDetailCard from '../../components/product/ProductDetailCard';
import './ProductDetails.css';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async (productId: string) => {
      setLoading(true);
      try {
        const fetchedProduct = await getProductById(productId);
        setProduct(fetchedProduct);
      } catch (err) {
        setError(`Error loading products. ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  if (loading)
    return (
      <div>
        <p>Loading…</p>
      </div>
    );
  if (error)
    return (
      <div>
        <p className="error">{error}</p>
      </div>
    );
  if (!product)
    return (
      <div>
        <p>Product not found.</p>
      </div>
    );

  return (
    <div className="product-details">
      <ProductDetailCard product={product} />
    </div>
  );
};

export default ProductDetails;
