import React, { useEffect, useState } from 'react';
import { Product } from '../../types/interfaces';
import { useParams } from 'react-router-dom';
import { getProductBySlug } from '../../services/product.service';
import ProductDetailCard from '../../components/product/ProductDetailCard';
import Loader from '../../components/loader/Loader';
import Breadcrumb from '../../components/breadcrumbs/Breadcrumbs';
import './ProductDetails.css';

const ProductDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async (productSlug: string) => {
      setLoading(true);
      try {
        const fetchedProduct = await getProductBySlug(productSlug);
        setProduct(fetchedProduct);
        setError(null);
      } catch (err) {
        setError(`Error loading product. ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct(slug);
    }
  }, [slug]);

  if (loading) return <Loader />;
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
      <Breadcrumb categoryPath={[]} currentCategory={product.name['en-US']} />
      <ProductDetailCard product={product} />
    </div>
  );
};

export default ProductDetails;
