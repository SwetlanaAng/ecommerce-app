import React, { useState } from 'react';
import { Product } from '../../types/interfaces';
import './ProductDetailCard.css';

interface Props {
  product: Product;
}

const ProductDetailCard: React.FC<Props> = ({ product }) => {
  const { name, description, masterVariant } = product;
  const title = name['en-US'];
  const desc = description?.['en-US'] || 'No description.';
  const images = masterVariant.images;
  const p = masterVariant.prices[0];
  const base = p.value.centAmount / 10 ** p.value.fractionDigits;
  const curr = p.value.currencyCode;
  const sale = p.discounted
    ? p.discounted.value.centAmount / 10 ** p.discounted.value.fractionDigits
    : null;

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="detail-card">
      <div className="detail-info">
        <h1 className="detail-title">{title}</h1>
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
      </div>

      <div className="detail-images">
        {images.length > 0 && (
          <div className="slider">
            <img
              src={images[currentIndex].url}
              alt={`${title} image ${currentIndex + 1}`}
              className="slider-image"
            />
            {images.length > 1 && (
              <>
                <button className="slider-btn prev" onClick={handlePrev}>
                  ‹
                </button>
                <button className="slider-btn next" onClick={handleNext}>
                  ›
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
    </div>
  );
};

export default ProductDetailCard;
