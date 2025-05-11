import React from 'react';
import { Link } from 'react-router-dom';
import { ProductCardProps } from '../../types/interfaces';
import './ProductCard.css';

const ProductCard: React.FC<ProductCardProps> = ({ id, name, price, imageUrl, description }) => {
  return (
    <Link to={`/catalog/${id}`} className="product-card">
      <div className="product-image">
        <img src={imageUrl} alt={name} />
      </div>
      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        <p className="product-price">${price}</p>
        {description && <p className="product-description">{description}</p>}
      </div>
    </Link>
  );
};

export default ProductCard;
