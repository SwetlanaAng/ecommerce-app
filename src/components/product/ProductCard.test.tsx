import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent, act } from '@testing-library/react';
import ProductCard from './ProductCard';
import { useCart } from '../../features/cart/hooks/useCart';

jest.mock('../../services/keys', () => ({
  KEYS: {
    API_URL: 'http://test-api.com',
    AUTH_URL: 'http://test-auth.com',
    PROJECT_KEY: 'test-project',
    CLIENT_ID: 'test-client',
    CLIENT_SECRET: 'test-secret',
    SCOPES: ['test-scope'],
  },
}));

jest.mock('../../services/cart.service', () => ({
  getCart: jest.fn(),
  createCart: jest.fn(),
  addProductToCart: jest.fn(),
}));

jest.mock('../../services/registration.service', () => ({
  getTokenFromStorage: jest.fn(),
}));

jest.mock('../../features/cart/hooks/useCart');
jest.mock('../../assets/basket.svg', () => 'basket.svg');
jest.mock('../../assets/tick.svg', () => 'tick.svg');
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockedUseCart = useCart as jest.Mock;

describe('ProductCard', () => {
  const defaultProps = {
    id: '123',
    name: 'Test Product',
    price: 19.99,
    originalPrice: 29.99,
    isOnSale: true,
    imageUrl: 'https://example.com/image.jpg',
    description: 'This is a test product',
    slug: 'test-product',
    category: 'test-category',
  };

  const renderComponent = (props = {}) => {
    return render(
      <MemoryRouter>
        <ProductCard {...defaultProps} {...props} />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseCart.mockReturnValue({
      addToCart: jest.fn(),
      cart: {
        lineItems: [],
      },
    });
  });

  it('renders product name, image, description, and prices correctly', () => {
    renderComponent();

    const image = screen.getByRole('img', { name: defaultProps.name });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', defaultProps.imageUrl);

    expect(screen.getByText(defaultProps.name)).toBeInTheDocument();

    expect(screen.getByText(defaultProps.description)).toBeInTheDocument();

    const originalPrice = screen.getByText(`$${defaultProps.originalPrice.toFixed(2)}`);
    expect(originalPrice).toBeInTheDocument();
    expect(originalPrice).toHaveClass('product-original-price');

    const discountedPrice = screen.getByText(`$${defaultProps.price.toFixed(2)}`);
    expect(discountedPrice).toBeInTheDocument();
    expect(discountedPrice).toHaveClass('product-price-discounted');

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/catalog/${defaultProps.slug}`);
  });

  it('does not show original price when not on sale', () => {
    renderComponent({ isOnSale: false, originalPrice: undefined });

    expect(screen.queryByText(`$${defaultProps.originalPrice.toFixed(2)}`)).not.toBeInTheDocument();

    const price = screen.getByText(`$${defaultProps.price.toFixed(2)}`);
    expect(price).toBeInTheDocument();
    expect(price).not.toHaveClass('product-price-discounted');
  });

  it('does not render description if it is not provided', () => {
    renderComponent({ description: undefined });
    expect(screen.queryByText(defaultProps.description)).not.toBeInTheDocument();
  });

  it('calls addToCart when add to cart button is clicked', async () => {
    const mockAddToCart = jest.fn().mockResolvedValue(undefined);
    mockedUseCart.mockReturnValue({
      addToCart: mockAddToCart,
      cart: {
        lineItems: [],
      },
    });

    renderComponent();

    const addToCartButton = screen.getByRole('button');

    await act(async () => {
      fireEvent.click(addToCartButton);
    });

    expect(mockAddToCart).toHaveBeenCalledWith(defaultProps.id);
  });

  it('shows tick icon when product is in cart', () => {
    mockedUseCart.mockReturnValue({
      addToCart: jest.fn(),
      cart: {
        lineItems: [{ productId: defaultProps.id }],
      },
    });

    renderComponent();

    const button = screen.getByRole('button');
    expect(button).toHaveClass('in-cart');
    expect(button).toBeDisabled();
  });

  it('displays category when provided', () => {
    renderComponent();

    expect(screen.getByText(defaultProps.category)).toBeInTheDocument();
  });

  it('displays best seller filter when product is best seller', () => {
    renderComponent({
      filters: { isBestSeller: true },
    });

    expect(screen.getByText('Best Seller')).toBeInTheDocument();
  });
});
