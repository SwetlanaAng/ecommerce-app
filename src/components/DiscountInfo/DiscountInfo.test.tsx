import { render, screen } from '@testing-library/react';
import DiscountInfo from './DiscountInfo';

describe('DiscountInfo', () => {
  it('renders nothing when no discounts are provided', () => {
    const { container } = render(<DiscountInfo />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when empty discounts array is provided', () => {
    const { container } = render(<DiscountInfo appliedDiscounts={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders discount badge for product discount', () => {
    const discounts = [
      {
        discountType: 'product' as const,
        discountAmount: 10,
        discountId: 'test-product-discount',
      },
    ];

    render(<DiscountInfo appliedDiscounts={discounts} />);

    expect(screen.getByText('Sale')).toBeInTheDocument();
    expect(screen.getByText('Sale').closest('.discount-badge')).toHaveClass('product');
  });

  it('renders discount badge for cart discount', () => {
    const discounts = [
      {
        discountType: 'cart' as const,
        discountAmount: 15,
        discountId: 'test-cart-discount',
      },
    ];
    const activePromoCodes = [{ id: 'test-cart-discount', code: 'HOLIDAY15' }];
    render(<DiscountInfo appliedDiscounts={discounts} activePromoCodes={activePromoCodes} />);
    expect(screen.getByText('HOLIDAY15')).toBeInTheDocument();
    expect(screen.getByText('HOLIDAY15').closest('.discount-badge')).toHaveClass('cart');
  });

  it('renders multiple discount badges', () => {
    const discounts = [
      {
        discountType: 'product' as const,
        discountAmount: 10,
        discountId: 'test-product-discount',
      },
      {
        discountType: 'cart' as const,
        discountAmount: 15,
        discountId: 'test-cart-discount',
      },
    ];
    const activePromoCodes = [{ id: 'test-cart-discount', code: 'HOLIDAY15' }];
    render(<DiscountInfo appliedDiscounts={discounts} activePromoCodes={activePromoCodes} />);
    expect(screen.getByText('Sale')).toBeInTheDocument();
    expect(screen.getByText('HOLIDAY15')).toBeInTheDocument();
    const discountBadges = screen.getAllByText(/Sale|HOLIDAY15/);
    expect(discountBadges).toHaveLength(2);
  });

  it('applies default className', () => {
    const discounts = [
      {
        discountType: 'product' as const,
        discountAmount: 10,
      },
    ];

    const { container } = render(<DiscountInfo appliedDiscounts={discounts} />);

    expect(container.firstChild).toHaveClass('discount-info');
  });

  it('applies custom className along with default', () => {
    const discounts = [
      {
        discountType: 'product' as const,
        discountAmount: 10,
      },
    ];

    const { container } = render(
      <DiscountInfo appliedDiscounts={discounts} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('discount-info', 'custom-class');
  });

  it('handles discounts without discountId', () => {
    const discounts = [
      {
        discountType: 'product' as const,
        discountAmount: 20,
      },
    ];

    render(<DiscountInfo appliedDiscounts={discounts} />);

    expect(screen.getByText('Sale')).toBeInTheDocument();
  });

  it('renders correct number of discount badges for multiple discounts of same type', () => {
    const discounts = [
      {
        discountType: 'product' as const,
        discountAmount: 10,
        discountId: 'discount-1',
      },
      {
        discountType: 'product' as const,
        discountAmount: 20,
        discountId: 'discount-2',
      },
    ];

    render(<DiscountInfo appliedDiscounts={discounts} />);

    const saleElements = screen.getAllByText('Sale');
    expect(saleElements).toHaveLength(2);

    saleElements.forEach(element => {
      expect(element.closest('.discount-badge')).toHaveClass('product');
    });
  });

  it('applies correct CSS classes structure', () => {
    const discounts = [
      {
        discountType: 'cart' as const,
        discountAmount: 15,
        discountId: 'test-cart-discount',
      },
    ];
    const activePromoCodes = [{ id: 'test-cart-discount', code: 'HOLIDAY15' }];
    render(<DiscountInfo appliedDiscounts={discounts} activePromoCodes={activePromoCodes} />);
    const discountTypeSpan = screen.getByText('HOLIDAY15');
    expect(discountTypeSpan).toHaveClass('discount-type');
    expect(discountTypeSpan.closest('.discount-badge')).toHaveClass('discount-badge', 'cart');
  });
});
