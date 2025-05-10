import React from 'react';
import { useParams } from 'react-router-dom';
import './ProductDetails.css';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="product-details">
      <h1>Product Details</h1>
      <p>Product ID: {id}</p>
      {/* Здесь будет детальная информация о товаре */}
    </div>
  );
};

export default ProductDetails;
