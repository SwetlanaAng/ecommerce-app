import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductCardProps } from '../../types/interfaces';
import { useCart } from '../../features/cart/hooks/useCart';
import addToCartIcon from '../../assets/basket.svg';
import { toast } from 'react-toastify';
import tickIcon from '../../assets/tick.svg';
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
  const { addToCart, cart } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const isInCart = cart?.lineItems.some(item => item.productId === id) || false;
  const isButtonDisabled = !id || isInCart || isAddingToCart;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (id && !isInCart && !isAddingToCart) {
      setIsAddingToCart(true);
      try {
        await addToCart(id);
        toast.success('Product added to cart');
      } catch {
        toast.error('Failed to add product to cart');
      } finally {
        setIsAddingToCart(false);
      }
    }
  };

  return (
    <Link to={`/catalog/${slug}`} className="product-card">
      <div className="product-image">
        <img src={imageUrl} alt={name} />
        {(filters?.isBestSeller || filters?.isGlutenFree) && (
          <div
            className={`product-filter ${filters?.isBestSeller ? 'best-seller' : 'gluten-free'}`}
          >
            {filters?.isBestSeller && 'Best Seller'}
            {filters?.isGlutenFree && 'Gluten Free'}
          </div>
        )}
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
            className={`add-to-cart-button ${isInCart ? 'in-cart' : ''} ${isAddingToCart ? 'loading' : ''}`}
            onClick={handleAddToCart}
            disabled={isButtonDisabled}
          >
            {isInCart ? (
              <img src={tickIcon} alt="add to cart" />
            ) : (
              <div className="add-to-cart-button-content">
                <img src={addToCartIcon} alt="add to cart" />
                <span>Buy</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
