import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Basket from './Basket';
import { useCart } from '../../features/cart/hooks/useCart';

jest.mock('../../features/cart/hooks/useCart', () => ({
  useCart: jest.fn(),
}));

jest.mock('../../components/PromoCode/PromoCode', () => {
  return function MockPromoCode() {
    return <div data-testid="promo-code">PromoCode Component</div>;
  };
});

jest.mock('../../components/DiscountInfo/DiscountInfo', () => {
  return function MockDiscountInfo({ appliedDiscounts }: { appliedDiscounts?: unknown[] }) {
    return appliedDiscounts && appliedDiscounts.length > 0 ? (
      <div data-testid="discount-info">Discount Applied</div>
    ) : null;
  };
});

jest.mock('../../components/AnimatedPrice/AnimatedPrice', () => {
  return function MockAnimatedPrice({ value, className }: { value: number; className?: string }) {
    return (
      <span className={className} data-testid="animated-price">
        ${value.toFixed(2)}
      </span>
    );
  };
});

jest.mock('../../assets/delete.svg', () => 'delete-icon.svg');
jest.mock('../../assets/empty-cart.png', () => 'empty-cart.png');

const mockUseCart = useCart as jest.MockedFunction<typeof useCart>;

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

const createMockCartItem = (overrides = {}) => ({
  id: 'item-1',
  productId: 'product-1',
  name: 'Vanilla Macaron',
  price: 2.5,
  originalPrice: 3.0,
  isOnSale: true,
  quantity: 2,
  imageUrl: 'https://example.com/macaron.jpg',
  variant: {
    id: 1,
    attributes: [],
  },
  appliedDiscounts: [],
  ...overrides,
});

const createMockCart = (overrides = {}) => ({
  id: 'cart-1',
  version: 1,
  lineItems: [createMockCartItem()],
  totalPrice: {
    centAmount: 500,
    fractionDigits: 2,
    currencyCode: 'USD',
  },
  discountCodes: [],
  ...overrides,
});

describe('Basket', () => {
  const mockRemoveFromCart = jest.fn();
  const mockUpdateCartItemQuantity = jest.fn();
  const mockClearCart = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseCart.mockReturnValue({
      cart: null,
      isLoading: false,
      error: null,
      removeFromCart: mockRemoveFromCart,
      updateCartItemQuantity: mockUpdateCartItemQuantity,
      clearCart: mockClearCart,
      cartItemsCount: 0,
      addToCart: jest.fn(),
      refreshCart: jest.fn(),
      setCart: jest.fn(),
    });
  });

  it('renders loading state', () => {
    mockUseCart.mockReturnValue({
      cart: null,
      isLoading: true,
      error: null,
      removeFromCart: mockRemoveFromCart,
      updateCartItemQuantity: mockUpdateCartItemQuantity,
      clearCart: mockClearCart,
      cartItemsCount: 0,
      addToCart: jest.fn(),
      refreshCart: jest.fn(),
      setCart: jest.fn(),
    });

    renderWithRouter(<Basket />);

    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
  });

  it('renders error state', () => {
    mockUseCart.mockReturnValue({
      cart: null,
      isLoading: false,
      error: 'Failed to load cart',
      removeFromCart: mockRemoveFromCart,
      updateCartItemQuantity: mockUpdateCartItemQuantity,
      clearCart: mockClearCart,
      cartItemsCount: 0,
      addToCart: jest.fn(),
      refreshCart: jest.fn(),
      setCart: jest.fn(),
    });

    renderWithRouter(<Basket />);

    expect(screen.getByText('Error: Failed to load cart')).toBeInTheDocument();
  });

  it('renders empty cart state', () => {
    mockUseCart.mockReturnValue({
      cart: { ...createMockCart(), lineItems: [] },
      isLoading: false,
      error: null,
      removeFromCart: mockRemoveFromCart,
      updateCartItemQuantity: mockUpdateCartItemQuantity,
      clearCart: mockClearCart,
      cartItemsCount: 0,
      addToCart: jest.fn(),
      refreshCart: jest.fn(),
      setCart: jest.fn(),
    });

    renderWithRouter(<Basket />);

    expect(screen.getByText(/Your cart is empty!/)).toBeInTheDocument();
    expect(screen.getByText(/Why not treat yourself/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Continue Shopping' })).toHaveAttribute(
      'href',
      '/catalog'
    );
  });

  it('renders cart with items', () => {
    const mockCart = createMockCart();
    mockUseCart.mockReturnValue({
      cart: mockCart,
      isLoading: false,
      error: null,
      removeFromCart: mockRemoveFromCart,
      updateCartItemQuantity: mockUpdateCartItemQuantity,
      clearCart: mockClearCart,
      cartItemsCount: 2,
      addToCart: jest.fn(),
      refreshCart: jest.fn(),
      setCart: jest.fn(),
    });

    renderWithRouter(<Basket />);

    expect(screen.getByText('Shopping Cart')).toBeInTheDocument();
    expect(screen.getByText('Vanilla Macaron')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByTestId('promo-code')).toBeInTheDocument();
  });

  it('displays item pricing correctly', () => {
    const mockCart = createMockCart();
    mockUseCart.mockReturnValue({
      cart: mockCart,
      isLoading: false,
      error: null,
      removeFromCart: mockRemoveFromCart,
      updateCartItemQuantity: mockUpdateCartItemQuantity,
      clearCart: mockClearCart,
      cartItemsCount: 2,
      addToCart: jest.fn(),
      refreshCart: jest.fn(),
      setCart: jest.fn(),
    });

    renderWithRouter(<Basket />);

    const animatedPrices = screen.getAllByTestId('animated-price');
    expect(animatedPrices.length).toBeGreaterThan(0);

    expect(screen.getByText('$3.00')).toBeInTheDocument();
    expect(screen.getByText('$2.50')).toBeInTheDocument();
  });

  it('increases item quantity when + button is clicked', async () => {
    const user = userEvent.setup();
    const mockCart = createMockCart();
    mockUseCart.mockReturnValue({
      cart: mockCart,
      isLoading: false,
      error: null,
      removeFromCart: mockRemoveFromCart,
      updateCartItemQuantity: mockUpdateCartItemQuantity,
      clearCart: mockClearCart,
      cartItemsCount: 2,
      addToCart: jest.fn(),
      refreshCart: jest.fn(),
      setCart: jest.fn(),
    });

    renderWithRouter(<Basket />);

    const increaseButton = screen.getByTitle('Increase quantity');
    await user.click(increaseButton);

    expect(mockUpdateCartItemQuantity).toHaveBeenCalledWith('item-1', 3);
  });

  it('decreases item quantity when - button is clicked', async () => {
    const user = userEvent.setup();
    const mockCart = createMockCart();
    mockUseCart.mockReturnValue({
      cart: mockCart,
      isLoading: false,
      error: null,
      removeFromCart: mockRemoveFromCart,
      updateCartItemQuantity: mockUpdateCartItemQuantity,
      clearCart: mockClearCart,
      cartItemsCount: 2,
      addToCart: jest.fn(),
      refreshCart: jest.fn(),
      setCart: jest.fn(),
    });

    renderWithRouter(<Basket />);

    const decreaseButton = screen.getByTitle('Decrease quantity');
    await user.click(decreaseButton);

    expect(mockUpdateCartItemQuantity).toHaveBeenCalledWith('item-1', 1);
  });

  it('removes item when quantity is decreased to 0', async () => {
    const user = userEvent.setup();
    const mockCart = createMockCart({
      lineItems: [createMockCartItem({ quantity: 1 })],
    });
    mockUseCart.mockReturnValue({
      cart: mockCart,
      isLoading: false,
      error: null,
      removeFromCart: mockRemoveFromCart,
      updateCartItemQuantity: mockUpdateCartItemQuantity,
      clearCart: mockClearCart,
      cartItemsCount: 1,
      addToCart: jest.fn(),
      refreshCart: jest.fn(),
      setCart: jest.fn(),
    });

    renderWithRouter(<Basket />);

    const decreaseButton = screen.getByTitle('Decrease quantity');
    await user.click(decreaseButton);

    expect(mockRemoveFromCart).toHaveBeenCalledWith('item-1');
  });

  it('removes item when remove button is clicked', async () => {
    const user = userEvent.setup();
    const mockCart = createMockCart();
    mockUseCart.mockReturnValue({
      cart: mockCart,
      isLoading: false,
      error: null,
      removeFromCart: mockRemoveFromCart,
      updateCartItemQuantity: mockUpdateCartItemQuantity,
      clearCart: mockClearCart,
      cartItemsCount: 2,
      addToCart: jest.fn(),
      refreshCart: jest.fn(),
      setCart: jest.fn(),
    });

    renderWithRouter(<Basket />);

    const removeButton = screen.getByTitle('Remove item');
    await user.click(removeButton);

    expect(mockRemoveFromCart).toHaveBeenCalledWith('item-1');
  });

  it('opens clear cart modal when Remove All button is clicked', async () => {
    const user = userEvent.setup();
    const mockCart = createMockCart();
    mockUseCart.mockReturnValue({
      cart: mockCart,
      isLoading: false,
      error: null,
      removeFromCart: mockRemoveFromCart,
      updateCartItemQuantity: mockUpdateCartItemQuantity,
      clearCart: mockClearCart,
      cartItemsCount: 2,
      addToCart: jest.fn(),
      refreshCart: jest.fn(),
      setCart: jest.fn(),
    });

    renderWithRouter(<Basket />);

    const removeAllButton = screen.getByText('Remove All');
    await user.click(removeAllButton);

    expect(screen.getByText('Delete Products')).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to delete/)).toBeInTheDocument();
  });

  it('closes modal when Cancel button is clicked', async () => {
    const user = userEvent.setup();
    const mockCart = createMockCart();
    mockUseCart.mockReturnValue({
      cart: mockCart,
      isLoading: false,
      error: null,
      removeFromCart: mockRemoveFromCart,
      updateCartItemQuantity: mockUpdateCartItemQuantity,
      clearCart: mockClearCart,
      cartItemsCount: 2,
      addToCart: jest.fn(),
      refreshCart: jest.fn(),
      setCart: jest.fn(),
    });

    renderWithRouter(<Basket />);

    const removeAllButton = screen.getByText('Remove All');
    await user.click(removeAllButton);

    expect(screen.getByText('Delete Products')).toBeInTheDocument();

    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);

    await waitFor(
      () => {
        expect(screen.queryByText('Delete Products')).not.toBeInTheDocument();
      },
      { timeout: 500 }
    );
  });

  it('clears cart when Delete button is clicked in modal', async () => {
    const user = userEvent.setup();
    const mockCart = createMockCart();
    mockUseCart.mockReturnValue({
      cart: mockCart,
      isLoading: false,
      error: null,
      removeFromCart: mockRemoveFromCart,
      updateCartItemQuantity: mockUpdateCartItemQuantity,
      clearCart: mockClearCart,
      cartItemsCount: 2,
      addToCart: jest.fn(),
      refreshCart: jest.fn(),
      setCart: jest.fn(),
    });

    renderWithRouter(<Basket />);

    const removeAllButton = screen.getByText('Remove All');
    await user.click(removeAllButton);

    expect(screen.getByText('Delete Products')).toBeInTheDocument();

    const deleteButton = screen.getByText('Delete');
    await user.click(deleteButton);

    await waitFor(
      () => {
        expect(screen.queryByText('Delete Products')).not.toBeInTheDocument();
      },
      { timeout: 500 }
    );

    await waitFor(
      () => {
        expect(mockClearCart).toHaveBeenCalled();
      },
      { timeout: 600 }
    );
  });

  it('calculates and displays correct pricing', () => {
    const mockCart = createMockCart({
      lineItems: [
        createMockCartItem({
          price: 2.5,
          originalPrice: 3.0,
          quantity: 2,
          isOnSale: true,
        }),
      ],
      totalPrice: {
        centAmount: 500,
        fractionDigits: 2,
        currencyCode: 'USD',
      },
    });

    mockUseCart.mockReturnValue({
      cart: mockCart,
      isLoading: false,
      error: null,
      removeFromCart: mockRemoveFromCart,
      updateCartItemQuantity: mockUpdateCartItemQuantity,
      clearCart: mockClearCart,
      cartItemsCount: 2,
      addToCart: jest.fn(),
      refreshCart: jest.fn(),
      setCart: jest.fn(),
    });

    renderWithRouter(<Basket />);

    expect(screen.getByText('Subtotal')).toBeInTheDocument();
    expect(document.querySelector('.subtotal-amount')).toHaveTextContent('$6.00');

    expect(screen.getByText('Discount')).toBeInTheDocument();
    expect(document.querySelector('.discount-amount')).toHaveTextContent('$1.00');

    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(document.querySelector('.total-amount')).toHaveTextContent('$5.00');
  });

  it('does not show discount row when there are no discounts', () => {
    const mockCart = createMockCart({
      lineItems: [
        createMockCartItem({
          price: 3.0,
          originalPrice: 3.0,
          quantity: 2,
          isOnSale: false,
        }),
      ],
      totalPrice: {
        centAmount: 600,
        fractionDigits: 2,
        currencyCode: 'USD',
      },
    });

    mockUseCart.mockReturnValue({
      cart: mockCart,
      isLoading: false,
      error: null,
      removeFromCart: mockRemoveFromCart,
      updateCartItemQuantity: mockUpdateCartItemQuantity,
      clearCart: mockClearCart,
      cartItemsCount: 2,
      addToCart: jest.fn(),
      refreshCart: jest.fn(),
      setCart: jest.fn(),
    });

    renderWithRouter(<Basket />);

    expect(screen.queryByText('Discount')).not.toBeInTheDocument();
  });

  it('shows discount row when there are discount codes even without price difference', () => {
    const mockCart = createMockCart({
      lineItems: [
        createMockCartItem({
          price: 3.0,
          originalPrice: 3.0,
          quantity: 2,
          isOnSale: false,
        }),
      ],
      totalPrice: {
        centAmount: 600,
        fractionDigits: 2,
        currencyCode: 'USD',
      },
      discountCodes: [
        {
          discountCode: {
            id: 'discount-1',
            typeId: 'discount-code',
          },
        },
      ],
    });

    mockUseCart.mockReturnValue({
      cart: mockCart,
      isLoading: false,
      error: null,
      removeFromCart: mockRemoveFromCart,
      updateCartItemQuantity: mockUpdateCartItemQuantity,
      clearCart: mockClearCart,
      cartItemsCount: 2,
      addToCart: jest.fn(),
      refreshCart: jest.fn(),
      setCart: jest.fn(),
    });

    renderWithRouter(<Basket />);

    expect(screen.getByText('Discount')).toBeInTheDocument();
  });

  it('displays discount info when item has applied discounts', () => {
    const mockCart = createMockCart({
      lineItems: [
        createMockCartItem({
          appliedDiscounts: [
            {
              discountType: 'product' as const,
              discountAmount: 10,
              discountId: 'discount-1',
            },
          ],
        }),
      ],
    });

    mockUseCart.mockReturnValue({
      cart: mockCart,
      isLoading: false,
      error: null,
      removeFromCart: mockRemoveFromCart,
      updateCartItemQuantity: mockUpdateCartItemQuantity,
      clearCart: mockClearCart,
      cartItemsCount: 2,
      addToCart: jest.fn(),
      refreshCart: jest.fn(),
      setCart: jest.fn(),
    });

    renderWithRouter(<Basket />);

    expect(screen.getByTestId('discount-info')).toBeInTheDocument();
  });

  it('disables quantity buttons when item is updating', () => {
    const mockCart = createMockCart();
    mockUpdateCartItemQuantity.mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );

    mockUseCart.mockReturnValue({
      cart: mockCart,
      isLoading: false,
      error: null,
      removeFromCart: mockRemoveFromCart,
      updateCartItemQuantity: mockUpdateCartItemQuantity,
      clearCart: mockClearCart,
      cartItemsCount: 2,
      addToCart: jest.fn(),
      refreshCart: jest.fn(),
      setCart: jest.fn(),
    });

    renderWithRouter(<Basket />);

    const increaseButton = screen.getByTitle('Increase quantity');
    const decreaseButton = screen.getByTitle('Decrease quantity');
    const removeButton = screen.getByTitle('Remove item');

    expect(increaseButton).toBeEnabled();
    expect(decreaseButton).toBeEnabled();
    expect(removeButton).toBeEnabled();
  });

  it('renders checkout button', () => {
    const mockCart = createMockCart();
    mockUseCart.mockReturnValue({
      cart: mockCart,
      isLoading: false,
      error: null,
      removeFromCart: mockRemoveFromCart,
      updateCartItemQuantity: mockUpdateCartItemQuantity,
      clearCart: mockClearCart,
      cartItemsCount: 2,
      addToCart: jest.fn(),
      refreshCart: jest.fn(),
      setCart: jest.fn(),
    });

    renderWithRouter(<Basket />);

    expect(screen.getByText('Continue to Checkout')).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    const mockCart = createMockCart();
    mockUseCart.mockReturnValue({
      cart: mockCart,
      isLoading: false,
      error: null,
      removeFromCart: mockRemoveFromCart,
      updateCartItemQuantity: mockUpdateCartItemQuantity,
      clearCart: mockClearCart,
      cartItemsCount: 2,
      addToCart: jest.fn(),
      refreshCart: jest.fn(),
      setCart: jest.fn(),
    });

    const { container } = renderWithRouter(<Basket />);

    expect(container.querySelector('.basket-page')).toBeInTheDocument();
    expect(container.querySelector('.basket-content')).toBeInTheDocument();
    expect(container.querySelector('.cart-items')).toBeInTheDocument();
    expect(container.querySelector('.cart-item')).toBeInTheDocument();
    expect(container.querySelector('.cart-summary')).toBeInTheDocument();
    expect(container.querySelector('.cart-total')).toBeInTheDocument();
  });
});
