import { render, screen } from '@testing-library/react';
import { CartIcon } from './CartIcon';

type CartIconProps = {
  title: string;
  count?: number;
};

const renderCartIcon = (props: CartIconProps = { title: 'cart' }) => {
  return render(<CartIcon {...props} />);
};

describe('CartIcon component', () => {
  it('renders correctly with required title prop', () => {
    renderCartIcon();

    expect(screen.getByTitle(/cart/i)).toBeInTheDocument();
  });

  it('renders the cart SVG icon', () => {
    const { container } = renderCartIcon();

    const svgElement = container.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
    expect(svgElement?.tagName).toBe('svg');
  });

  it('applies the correct CSS class', () => {
    const { container } = renderCartIcon();

    const cartElement = container.querySelector('.cart');
    expect(cartElement).toBeInTheDocument();
  });

  it('does not display badge when count is 0', () => {
    renderCartIcon({ title: 'cart', count: 0 });

    const badge = screen.queryByText('0');
    expect(badge).not.toBeInTheDocument();
  });

  it('does not display badge when count is not provided', () => {
    renderCartIcon({ title: 'cart' });

    const badgeElement = document.querySelector('.cart-badge');
    expect(badgeElement).not.toBeInTheDocument();
  });

  it('displays badge when count is greater than 0', () => {
    renderCartIcon({ title: 'cart', count: 3 });

    const badge = screen.getByText('3');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('cart-badge');
  });

  it('displays correct count in badge for single digit', () => {
    renderCartIcon({ title: 'cart', count: 5 });

    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('displays correct count in badge for double digit', () => {
    renderCartIcon({ title: 'cart', count: 99 });

    expect(screen.getByText('99')).toBeInTheDocument();
  });

  it('displays correct count in badge for large numbers', () => {
    renderCartIcon({ title: 'cart', count: 1000 });

    expect(screen.getByText('1000')).toBeInTheDocument();
  });

  it('uses custom title when provided', () => {
    renderCartIcon({ title: 'Shopping Cart' });

    expect(screen.getByTitle('Shopping Cart')).toBeInTheDocument();
  });

  it('maintains accessibility with proper title attribute', () => {
    renderCartIcon({ title: 'My Custom Cart Title' });

    const cartElement = screen.getByTitle('My Custom Cart Title');
    expect(cartElement).toBeInTheDocument();
  });

  it('renders correctly with zero count explicitly set', () => {
    renderCartIcon({ title: 'cart', count: 0 });

    const badge = screen.queryByText('0');
    expect(badge).not.toBeInTheDocument();
  });
});
