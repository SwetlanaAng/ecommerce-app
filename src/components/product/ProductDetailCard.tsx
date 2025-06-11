import React, { useState, useEffect } from 'react';
import { Product } from '../../types/interfaces';
import { toast } from 'react-toastify';
import { useCart } from '../../features/cart/hooks/useCart';
import ImageModal from '../image/ImageModal';
import './ProductDetailCard.css';

interface Props {
  product: Product;
}

const ProductDetailCard: React.FC<Props> = ({ product }) => {
  const { cart, removeFromCart } = useCart();
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

  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!lineItemId || isRemoving) return;

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
        <div className="detail-actions">
          {(inCart || isRemoving) && (
            <button className="btn" onClick={handleRemove} disabled={isRemoving}>
              {isRemoving ? 'Removing…' : 'Remove from Cart'}
            </button>
          )}
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
  );
};

export default ProductDetailCard;
