import React, { useState } from 'react';
import { useCart } from '../../features/cart/hooks/useCart';
import { Link } from 'react-router-dom';
import { CartItem } from '../../types/interfaces';
import Loader from '../../components/loader/Loader';
import Button from '../../components/button/Button';
import AnimatedPrice from '../../components/AnimatedPrice/AnimatedPrice';
import deleteIcon from '../../assets/delete.svg';
import './Basket.css';

const Basket: React.FC = () => {
  const { cart, isLoading, error, removeFromCart, updateCartItemQuantity, clearCart } = useCart();
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  const handleQuantityChange = async (lineItemId: string, newQuantity: number) => {
    setUpdatingItems(prev => new Set(prev).add(lineItemId));

    try {
      if (newQuantity <= 0) {
        await removeFromCart(lineItemId);
      } else {
        await updateCartItemQuantity(lineItemId, newQuantity);
      }
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(lineItemId);
        return newSet;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="basket-page">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="basket-page">
        <div className="basket-error">Error: {error}</div>
      </div>
    );
  }

  if (!cart || cart.lineItems.length === 0) {
    return (
      <div className="basket-page">
        <h1 className="basket-title">Shopping Cart</h1>
        <div className="empty-cart">
          <h4>Your cart is empty</h4>
          <Link to="/catalog" className="continue-shopping-btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const totalAmount = cart.totalPrice.centAmount / Math.pow(10, cart.totalPrice.fractionDigits);

  return (
    <div className="basket-page">
      <h1>Shopping Cart</h1>

      <div className="basket-content">
        <div className="cart-items">
          {cart.lineItems.map((item: CartItem) => {
            const isUpdating = updatingItems.has(item.id);

            return (
              <div key={item.id} className={`cart-item ${isUpdating ? 'updating' : ''}`}>
                <div className="cart-item-image">
                  <img src={item.imageUrl} alt={item.name} />
                </div>

                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.name}</h3>
                  <div className="cart-item-price">
                    {item.isOnSale &&
                      item.originalPrice &&
                      typeof item.originalPrice === 'number' && (
                        <AnimatedPrice
                          value={item.originalPrice}
                          className="cart-item-original-price"
                        />
                      )}
                    <AnimatedPrice
                      value={typeof item.price === 'number' ? item.price : 0}
                      className={`cart-item-current-price ${item.isOnSale ? 'discounted' : ''}`}
                    />
                  </div>
                </div>

                <div className="cart-item-quantity">
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    disabled={isUpdating}
                    title="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="quantity-display">{item.quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    disabled={isUpdating}
                    title="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <div className="cart-item-total">
                  <AnimatedPrice
                    value={typeof item.price === 'number' ? item.price * item.quantity : 0}
                  />
                </div>

                <button
                  className="remove-item-btn"
                  onClick={() => removeFromCart(item.id)}
                  disabled={isUpdating}
                  title="Remove item"
                >
                  <img src={deleteIcon} alt="Delete" />
                </button>
              </div>
            );
          })}
        </div>

        <div className="cart-summary">
          <div className="cart-total">
            <div className="total-line">
              <span>Subtotal:</span>
              <AnimatedPrice value={totalAmount} />
            </div>
            <div className="total-line total-final">
              <span>Total:</span>
              <AnimatedPrice value={totalAmount} />
            </div>
          </div>

          <div className="cart-actions">
            <Button className="primary" onClick={clearCart} disabled={isLoading}>
              Clear Cart
            </Button>
            <Link to="/catalog" className="continue-shopping-btn">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Basket;
