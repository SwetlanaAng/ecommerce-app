import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import ProductCard from './ProductCard';

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
});
