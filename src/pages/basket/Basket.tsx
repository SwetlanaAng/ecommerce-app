import React, { useState } from 'react';
import { useCart } from '../../features/cart/hooks/useCart';
import { Link } from 'react-router-dom';
import { CartItem } from '../../types/interfaces';
import Loader from '../../components/loader/Loader';
import Button from '../../components/button/Button';
import AnimatedPrice from '../../components/AnimatedPrice/AnimatedPrice';
import PromoCode from '../../components/PromoCode/PromoCode';
import DiscountInfo from '../../components/DiscountInfo/DiscountInfo';
import { Modal } from '../../components/modal/Modal';
import deleteIcon from '../../assets/delete.svg';
import emptyCart from '../../assets/empty-cart.png';
import './Basket.css';

const Basket: React.FC = () => {
  const { cart, isLoading, error, removeFromCart, updateCartItemQuantity, clearCart } = useCart();
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        <div className="empty-cart">
          <img src={emptyCart} alt="empty cart" />
          <h1>
            <span>Oh là là...</span>Your cart is empty!
          </h1>
          <p>
            Why not treat yourself to a few colorful bites of joy? Explore our handcrafted macarons
            and find your favorites
          </p>
          <Link to="/catalog" className="continue-shopping-btn btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const totalAmount = cart.totalPrice.centAmount / Math.pow(10, cart.totalPrice.fractionDigits);

  const subtotalAmount = cart.lineItems.reduce((sum, item) => {
    const itemOriginalPrice = item.isOnSale && item.originalPrice ? item.originalPrice : item.price;
    return sum + (typeof itemOriginalPrice === 'number' ? itemOriginalPrice * item.quantity : 0);
  }, 0);

  const actualDiscountedAmount = subtotalAmount - totalAmount;

  return (
    <div className="basket-page">
      <h1>Shopping Cart</h1>

      <Button className="clear-cart-btn" onClick={() => setIsModalOpen(true)} disabled={isLoading}>
        <img src={deleteIcon} alt="delete" />
        Remove All
      </Button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="modal-delete-products">
          <h4>Delete Products</h4>
          <p>
            Are you sure you want to delete the selected products? It will not be possible to cancel
            this action
          </p>
          <div className="modal-actions">
            <Button className="primary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="delete-btn"
              onClick={() => {
                setIsModalOpen(false);
                setTimeout(() => {
                  clearCart();
                }, 500);
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      <div className="basket-content">
        <div className="cart-items">
          {cart.lineItems.map((item: CartItem) => {
            const isUpdating = updatingItems.has(item.id);

            return (
              <div key={item.id} className={`cart-item ${isUpdating ? 'updating' : ''}`}>
                <div className="cart-item-image">
                  <img src={item.imageUrl} alt={item.name} />
                </div>

                <div className="cart-item-info">
                  <div className="cart-item-details">
                    <h4 className="cart-item-name">{item.name}</h4>
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
                    <DiscountInfo appliedDiscounts={item.appliedDiscounts} />
                  </div>

                  <div className="cart-item-quantity">
                    <button
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      disabled={isUpdating}
                      title="Decrease quantity"
                    >
                      ‒
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
                </div>

                <button
                  className="remove-item-btn"
                  onClick={() => removeFromCart(item.id)}
                  disabled={isUpdating}
                  title="Remove item"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>

        <div className="cart-summary">
          <PromoCode />
          <div className="cart-total">
            <div className="total-line subtotal">
              <span>Subtotal:</span>
              <div className="subtotal-price">
                <AnimatedPrice value={subtotalAmount} className="subtotal-amount" />
              </div>
            </div>
            {(actualDiscountedAmount > 0 || cart.discountCodes?.length !== 0) && (
              <div className="total-line discount">
                <span>Discount:</span>
                <AnimatedPrice value={actualDiscountedAmount} className="discount-amount" />
              </div>
            )}
            <div className="total-line total-final">
              <span>Total:</span>
              <AnimatedPrice value={totalAmount} className="total-amount" />
            </div>
          </div>

          <div className="cart-actions">
            <Button>Continue to Checkout</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Basket;
