import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useCartWithPromoCodes } from '../../hooks/useCartWithPromoCodes';
import Button from '../button/Button';
import Input from '../input/Input';
import arrowIcon from '../../assets/arrow.svg';
import './PromoCode.css';

const PromoCode: React.FC = () => {
  const { addPromoCode, removePromoCode, promoCodeError, activePromoCodes } =
    useCartWithPromoCodes();
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (promoCodeError) {
      toast.error(promoCodeError);
    }
  }, [promoCodeError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCodeInput.trim()) return;

    const codeToAdd = promoCodeInput.trim();

    setIsSubmitting(true);
    const success = await addPromoCode(codeToAdd);
    setIsSubmitting(false);

    if (success) {
      toast.success(`Promo code "${codeToAdd}" applied successfully!`);
      setPromoCodeInput('');
    } else {
      if (!promoCodeError) {
        toast.error(`Promo code "${codeToAdd}" is not applicable to items in your cart`);
      }
    }
  };

  const handleRemovePromoCode = async (promocodeId: string) => {
    await removePromoCode(promocodeId);
    toast.success('Promo code removed successfully!');
  };

  const buttonText = isSubmitting ? '...' : <img src={arrowIcon} alt="arrow" />;

  return (
    <div className="promo-code-section">
      <form onSubmit={handleSubmit} className="promo-code-form">
        <div className="promo-code-input-group">
          <Input
            name="promo-code"
            id="promo-code"
            labelText="Promo code"
            type="text"
            value={promoCodeInput}
            onChange={e => setPromoCodeInput(e.target.value)}
            className="promo-code-input"
            disabled={isSubmitting}
          />
          <Button
            type="submit"
            disabled={!promoCodeInput.trim() || isSubmitting}
            className="promo-code-submit"
          >
            {buttonText}
          </Button>
        </div>
      </form>

      {activePromoCodes.length > 0 && (
        <div className="active-promo-codes">
          {activePromoCodes.map(code => (
            <div key={code.id} className="active-promo-code applied">
              <span>{code.name || code.code || code.id.substring(0, 8) + '...'}</span>
              <button
                onClick={() => handleRemovePromoCode(code.id)}
                className="remove-promo-btn"
                title="Remove promo code"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PromoCode;
