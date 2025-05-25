import React from 'react';
import { Link } from 'react-router-dom';
import { ProductCardProps } from '../../types/interfaces';
import './ProductCard.css';

const ProductCard: React.FC<ProductCardProps> = ({
  name,
  price,
  originalPrice,
  isOnSale,
  imageUrl,
  description,
  slug,
}) => {
  return (
    <Link to={`/catalog/${slug}`} className="product-card">
      <div className="product-image">
        <img src={imageUrl} alt={name} />
      </div>
      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        {description && <p className="product-description">{description}</p>}
        <div className="product-price-container">
          {isOnSale && originalPrice && (
            <span className="product-original-price">${originalPrice.toFixed(2)}</span>
          )}
          <span className={`product-price ${isOnSale ? 'product-price-discounted' : ''}`}>
            ${price.toFixed(2)}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
