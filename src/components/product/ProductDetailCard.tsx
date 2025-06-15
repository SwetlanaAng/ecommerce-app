import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../types/interfaces';
import { toast } from 'react-toastify';
import { useCart } from '../../features/cart/hooks/useCart';
import ImageModal from '../image/ImageModal';
import starIcon from '../../assets/star.svg';
import Button from '../button/Button';
import ProductCard from './ProductCard';
import { getProductsList } from '../../services/products.service';
import toCardAdapter from '../../lib/utils/productDataAdapters/toCardAdapter';

import './ProductDetailCard.css';

interface Props {
  product: Product;
}

const ProductDetailCard: React.FC<Props> = ({ product }) => {
  const navigate = useNavigate();
  const { cart, removeFromCart, addToCart } = useCart();
  const { name, description, masterVariant } = product;
  const title = name['en-US'];
  const desc = description?.['en-US'] || 'No description.';
  const images = masterVariant.images;
  const priceInfo = masterVariant.prices[0];
  const base = priceInfo.value.centAmount / 10 ** priceInfo.value.fractionDigits;
  const curr = priceInfo.value.currencyCode;
  const sale = priceInfo.discounted
    ? priceInfo.discounted.value.centAmount / 10 ** priceInfo.discounted.value.fractionDigits
    : null;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const [inCart, setInCart] = useState(false);
  const [lineItemId, setLineItemId] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const descPreview = desc.length > 210 ? desc.slice(0, 210) + '…' : desc;
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const products = await getProductsList();
        if (products && products.length > 4) {
          const shuffled = products.sort(() => 0.5 - Math.random());
          setFeaturedProducts(shuffled.slice(0, 4));
        } else {
          setFeaturedProducts(products);
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
      }
    };

    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  useEffect(() => {
    const item = cart?.lineItems.find(item => item.productId === product.id);
    setInCart(!!item);
    setLineItemId(item?.id || null);
  }, [cart, product.id]);

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleAdd = async () => {
    if (inCart || isAdding || isRemoving) return;
    setIsAdding(true);
    try {
      await addToCart(product.id);
      toast.success('Item added to cart');
    } catch {
      toast.error('Failed to add item. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemove = async () => {
    if (!lineItemId || isRemoving || isAdding) return;
    setIsRemoving(true);
    try {
      await removeFromCart(lineItemId);
      toast.success('Item removed from cart');
    } catch {
      toast.error('Failed to remove item. Please try again.');
    } finally {
      setIsRemoving(false);
    }
  };

  const rating = 5.0;
  const reviews = 247;

  return (
    <div className="detail-container">
      <div className="detail-card">
        <div className="detail-info">
          <div className="detail-rating-row">
            <img src={starIcon} alt="star" className="detail-star" />
            <span className="detail-rating">{rating.toFixed(1)}</span>
            <span className="detail-reviews">({reviews} reviews)</span>
          </div>
          <h1 className="detail-title">{title}</h1>
          <div className="detail-description">
            <p>{showFullDesc ? desc : descPreview}</p>
            {desc.length > 210 && !showFullDesc && (
              <div className="detail-read-more" onClick={() => setShowFullDesc(true)}>
                Read more
              </div>
            )}
          </div>
          <div className="detail-price">
            {sale != null ? (
              <>
                <span className="detail-price-sale">
                  {sale.toFixed(2)} {curr}
                </span>
                <span className="detail-price-original">
                  {base.toFixed(2)} {curr}
                </span>
              </>
            ) : (
              <span className="detail-price-current">
                {base.toFixed(2)} {curr}
              </span>
            )}
          </div>
          <div className="detail-actions">
            {!inCart && !isRemoving && (
              <Button className="btn" onClick={handleAdd} disabled={isAdding}>
                {isAdding ? 'Adding…' : 'Add to Cart'}
              </Button>
            )}
            {(inCart || isRemoving) && (
              <Button className="btn primary" onClick={handleRemove} disabled={isRemoving}>
                {isRemoving ? 'Removing…' : 'Remove from Cart'}
              </Button>
            )}
          </div>
          <div className="advantages">
            <div className="advantage">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.7 17.1V6.90001C13.7 6.44914 13.5209 6.01674 13.2021 5.69793C12.8833 5.37912 12.4509 5.20001 12 5.20001H5.2C4.74913 5.20001 4.31673 5.37912 3.99792 5.69793C3.67911 6.01674 3.5 6.44914 3.5 6.90001V16.25C3.5 16.4754 3.58955 16.6916 3.74896 16.8511C3.90837 17.0105 4.12457 17.1 4.35 17.1H6.05M6.05 17.1C6.05 18.0389 6.81112 18.8 7.75 18.8C8.68888 18.8 9.45 18.0389 9.45 17.1M6.05 17.1C6.05 16.1611 6.81112 15.4 7.75 15.4C8.68888 15.4 9.45 16.1611 9.45 17.1M14.55 17.1H9.45M14.55 17.1C14.55 18.0389 15.3111 18.8 16.25 18.8C17.1889 18.8 17.95 18.0389 17.95 17.1M14.55 17.1C14.55 16.1611 15.3111 15.4 16.25 15.4C17.1889 15.4 17.95 16.1611 17.95 17.1M17.95 17.1H19.65C19.8754 17.1 20.0916 17.0105 20.251 16.8511C20.4104 16.6916 20.5 16.4754 20.5 16.25V13.1475C20.4997 12.9546 20.4337 12.7676 20.313 12.6171L17.355 8.91961C17.2755 8.82006 17.1746 8.73965 17.0599 8.68433C16.9451 8.62901 16.8194 8.60019 16.692 8.60001H13.7"
                  stroke="#E7426D"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="advantage-text">
                <span className="advantage-text-title">Free Next-Day Delivery</span>
                <span className="advantage-text-description">
                  on all orders over $50 in most states
                </span>
              </div>
            </div>

            <div className="advantage">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.16 14.24C8.58435 14.24 8.99131 14.4086 9.29137 14.7086C9.59143 15.0087 9.76 15.4157 9.76 15.84M20 9.2C20 10.7464 18.7464 12 17.2 12C15.6536 12 14.4 10.7464 14.4 9.2C14.4 7.6536 15.6536 6.4 17.2 6.4C18.7464 6.4 20 7.6536 20 9.2ZM12.8 15.6C12.8 18.0301 10.8301 20 8.4 20C5.96995 20 4 18.0301 4 15.6C4 13.1699 5.96995 11.2 8.4 11.2C10.8301 11.2 12.8 13.1699 12.8 15.6ZM10.4 6C10.4 7.10457 9.50457 8 8.4 8C7.29543 8 6.4 7.10457 6.4 6C6.4 4.89543 7.29543 4 8.4 4C9.50457 4 10.4 4.89543 10.4 6Z"
                  stroke="#E7426D"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="advantage-text">
                <span className="advantage-text-title">Temperature-Safe Shipping</span>
                <span className="advantage-text-description">
                  your macarons arrive fresh and intact
                </span>
              </div>
            </div>

            <div className="advantage">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 20H18M11 20C16.5 17.5 11.8 13.6 14 10M14 10C13.9541 8.58615 14.3376 7.19156 15.1 6C16 5 17.3 4.1 20 4C19.9 6.3 19.3 7.6 18.3 8.6C17.3 9.4 15.9 9.9 14 10ZM10.5 9.4C11.6 10.2 12.3 11.6 12.8 13.1C10.8 13.5 9.3 13.5 8 12.8C6.8 12.2 5.7 10.9 5 8.6C7.8 8.1 9.4 8.6 10.5 9.4Z"
                  stroke="#E7426D"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="advantage-text">
                <span className="advantage-text-title">Natural Ingredients</span>
                <span className="advantage-text-description">no preservatives</span>
              </div>
            </div>

            <div className="advantage">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.9999 20.501V12.0002M11.9999 12.0002L4.59565 7.74973M11.9999 12.0002L19.4042 7.74973M8.17451 5.42899L15.8253 9.80694M11.1498 20.2715C11.4083 20.4207 11.7015 20.4993 11.9999 20.4993C12.2983 20.4993 12.5915 20.4207 12.85 20.2715L18.8006 16.8712C19.0588 16.7221 19.2733 16.5077 19.4225 16.2496C19.5717 15.9915 19.6504 15.6987 19.6507 15.4005V8.59982C19.6504 8.30167 19.5717 8.00884 19.4225 7.75072C19.2733 7.49259 19.0588 7.27824 18.8006 7.12917L12.85 3.72882C12.5915 3.5796 12.2983 3.50104 11.9999 3.50104C11.7015 3.50104 11.4083 3.5796 11.1498 3.72882L5.19921 7.12917C4.941 7.27824 4.72654 7.49259 4.57734 7.75072C4.42813 8.00884 4.34943 8.30167 4.34912 8.59982V15.4005C4.34943 15.6987 4.42813 15.9915 4.57734 16.2496C4.72654 16.5077 4.941 16.7221 5.19921 16.8712L11.1498 20.2715Z"
                  stroke="#E7426D"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="advantage-text">
                <span className="advantage-text-title">Perfect Gift</span>
                <span className="advantage-text-description">
                  comes in elegant, ready-to-gift packaging
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="detail-images">
          {images.length > 0 && (
            <div className="slider">
              <img
                src={images[currentIndex].url}
                alt={`${title} image ${currentIndex + 1}`}
                className="slider-image"
                onClick={() => {
                  setModalIndex(currentIndex);
                  setIsModalOpen(true);
                }}
              />

              {images.length > 1 && (
                <>
                  <button className="slider-btn prev" onClick={handlePrev}>
                    ⟨
                  </button>
                  <button className="slider-btn next" onClick={handleNext}>
                    ⟩
                  </button>
                </>
              )}
            </div>
          )}
          {images.length > 1 && (
            <div className="detail-images-thumbs">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img.url}
                  alt={`${title} thumbnail ${idx + 1}`}
                  className={`thumb-image ${currentIndex === idx ? 'active' : ''}`}
                  onClick={() => setCurrentIndex(idx)}
                />
              ))}
            </div>
          )}
        </div>
        <ImageModal
          images={images}
          isOpen={isModalOpen}
          initialIndex={modalIndex}
          onClose={() => setIsModalOpen(false)}
        />
      </div>

      <div className="detail-related">
        <div className="detail-related-title">
          <h1>You Might Also Love</h1>
          <div className="view-all-container">
            <Button className="view-all-button" onClick={() => navigate('/catalog')}>
              View All →
            </Button>
          </div>
        </div>
        <div className="featured-products-grid">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} {...toCardAdapter(product)} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailCard;
