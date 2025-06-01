import React from 'react';
import { useCart } from '../../features/cart/hooks/useCart';
import { Link } from 'react-router-dom';
import { CartItem } from '../../types/interfaces';
import Loader from '../../components/loader/Loader';
import Button from '../../components/button/Button';
import deleteIcon from '../../assets/delete.svg';
import './Basket.css';

const Basket: React.FC = () => {
  const { cart, isLoading, error, removeFromCart, updateCartItemQuantity, clearCart } = useCart();

  const handleQuantityChange = async (lineItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeFromCart(lineItemId);
    } else {
      await updateCartItemQuantity(lineItemId, newQuantity);
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
          {cart.lineItems.map((item: CartItem) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-image">
                <img src={item.imageUrl} alt={item.name} />
              </div>

              <div className="cart-item-details">
                <h3 className="cart-item-name">{item.name}</h3>
                <div className="cart-item-price">
                  {item.isOnSale &&
                    item.originalPrice &&
                    typeof item.originalPrice === 'number' && (
                      <span className="cart-item-original-price">
                        ${item.originalPrice.toFixed(2)}
                      </span>
                    )}
                  <span className={`cart-item-current-price ${item.isOnSale ? 'discounted' : ''}`}>
                    ${typeof item.price === 'number' ? item.price.toFixed(2) : '0.00'}
                  </span>
                </div>
              </div>

              <div className="cart-item-quantity">
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  title="Decrease quantity"
                >
                  -
                </button>
                <span className="quantity-display">{item.quantity}</span>
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  title="Increase quantity"
                >
                  +
                </button>
              </div>

              <div className="cart-item-total">
                ${typeof item.price === 'number' ? (item.price * item.quantity).toFixed(2) : '0.00'}
              </div>

              <button
                className="remove-item-btn"
                onClick={() => removeFromCart(item.id)}
                title="Remove item"
              >
                <img src={deleteIcon} alt="Delete" />
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="cart-total">
            <div className="total-line">
              <span>Subtotal:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <div className="total-line total-final">
              <span>Total:</span>
              <span>${totalAmount.toFixed(2)}</span>
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
