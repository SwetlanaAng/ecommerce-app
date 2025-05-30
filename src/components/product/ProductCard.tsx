import React from 'react';
import { Link } from 'react-router-dom';
import { ProductCardProps } from '../../types/interfaces';
import { useCart } from '../../features/cart/hooks/useCart';
import addToCartIcon from '../../assets/basket.svg';
import './ProductCard.css';

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  originalPrice,
  isOnSale,
  imageUrl,
  description,
  slug,
  filters,
  category,
}) => {
  const { addToCart, isLoading } = useCart();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (id && !isLoading) {
      await addToCart(id);
    }
  };

  return (
    <Link to={`/catalog/${slug}`} className="product-card">
      <div className="product-image">
        <img src={imageUrl} alt={name} />
        {filters?.isBestSeller && <div className="product-filter">Best Seller</div>}
        {category && <div className="product-category">{category}</div>}
      </div>
      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        {description && <p className="product-description">{description}</p>}
        <div className="product-price-container-wrapper">
          <div className="product-price-container">
            {isOnSale && originalPrice && (
              <span className="product-original-price">${originalPrice.toFixed(2)}</span>
            )}
            <span className={`product-price ${isOnSale ? 'product-price-discounted' : ''}`}>
              ${price.toFixed(2)}
            </span>
          </div>
          <button
            className={`add-to-cart-button ${isLoading ? 'loading' : ''}`}
            onClick={handleAddToCart}
            disabled={isLoading || !id}
            title={!id ? 'Product ID required' : isLoading ? 'Adding...' : 'Add to cart'}
          >
            <img src={addToCartIcon} alt="add to cart" />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
