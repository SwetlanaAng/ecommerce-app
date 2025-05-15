import React from 'react';
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
        {images[0] && (
          <div className="detail-images-main">
            <img src={images[0].url} alt={title} />
          </div>
        )}
        {images.length > 1 && (
          <div className="detail-images-thumbs">
            {images.slice(1).map((img, idx) => (
              <img
                key={idx}
                src={img.url}
                alt={`${title} thumbnail ${idx + 2}`}
                className="thumb-image"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailCard;
