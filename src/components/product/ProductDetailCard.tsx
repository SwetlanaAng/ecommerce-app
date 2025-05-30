import React, { useState, useEffect } from 'react';
import { Product } from '../../types/interfaces';
import { useCart } from '../../features/cart/hooks/useCart';
import ImageModal from '../image/ImageModal';
import addToCartIcon from '../../assets/basket.svg';
import Button from '../button/Button';
import './ProductDetailCard.css';

interface Props {
  product: Product;
}

const ProductDetailCard: React.FC<Props> = ({ product }) => {
  const { name, description, masterVariant, id } = product;
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

  const { addToCart, isLoading } = useCart();

  const handleAddToCart = async () => {
    if (id && !isLoading) {
      await addToCart(id);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="detail-card">
      <div className="detail-info">
        <h2 className="detail-title">{title}</h2>
        <p className="detail-description">{desc}</p>
        <div className="detail-price">
          {sale != null ? (
            <>
              <span className="detail-price-original">
                {base.toFixed(2)} {curr}
              </span>
              <span className="detail-price-sale">
                {sale.toFixed(2)} {curr}
              </span>
            </>
          ) : (
            <span className="detail-price-current">
              {base.toFixed(2)} {curr}
            </span>
          )}
        </div>

        <Button
          className={`detail-add-to-cart-btn primary ${isLoading ? 'loading' : ''}`}
          onClick={handleAddToCart}
          disabled={isLoading || !id}
        >
          <img src={addToCartIcon} alt="add to cart" />
          <span>{isLoading ? 'Adding...' : 'Add to Cart'}</span>
        </Button>
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
  );
};

export default ProductDetailCard;
