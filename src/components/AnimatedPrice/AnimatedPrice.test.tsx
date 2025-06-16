import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AnimatedPrice from './AnimatedPrice';
import * as useAnimatedPriceModule from '../../features/cart/hooks/useAnimatedPrice';

jest.mock('./AnimatedPrice.css', () => ({}));

jest.mock('../../features/cart/hooks/useAnimatedPrice');

const mockUseAnimatedPrice = jest.mocked(useAnimatedPriceModule.useAnimatedPrice);

describe('AnimatedPrice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders with default props', () => {
      mockUseAnimatedPrice.mockReturnValue({
        value: 99.99,
        formattedValue: '99.99',
        isAnimating: false,
      });

      render(<AnimatedPrice value={99.99} />);

      expect(screen.getByText('$99.99')).toBeInTheDocument();
    });

    it('renders with custom currency', () => {
      mockUseAnimatedPrice.mockReturnValue({
        value: 85.5,
        formattedValue: '85.50',
        isAnimating: false,
      });

      render(<AnimatedPrice value={85.5} currency="€" />);

      expect(screen.getByText('€85.50')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      mockUseAnimatedPrice.mockReturnValue({
        value: 42.0,
        formattedValue: '42.00',
        isAnimating: false,
      });

      render(<AnimatedPrice value={42.0} className="custom-price" />);

      const priceElement = screen.getByText('$42.00');
      expect(priceElement).toHaveClass('animated-price', 'custom-price');
    });

    it('applies animating class when isAnimating is true', () => {
      mockUseAnimatedPrice.mockReturnValue({
        value: 123.45,
        formattedValue: '123.45',
        isAnimating: true,
      });

      render(<AnimatedPrice value={123.45} />);

      const priceElement = screen.getByText('$123.45');
      expect(priceElement).toHaveClass('animated-price', 'animating');
    });

    it('does not apply animating class when isAnimating is false', () => {
      mockUseAnimatedPrice.mockReturnValue({
        value: 67.89,
        formattedValue: '67.89',
        isAnimating: false,
      });

      render(<AnimatedPrice value={67.89} />);

      const priceElement = screen.getByText('$67.89');
      expect(priceElement).toHaveClass('animated-price');
      expect(priceElement).not.toHaveClass('animating');
    });
  });

  describe('Hook Integration', () => {
    it('passes correct props to useAnimatedPrice hook', () => {
      mockUseAnimatedPrice.mockReturnValue({
        value: 99.99,
        formattedValue: '99.99',
        isAnimating: false,
      });

      render(<AnimatedPrice value={99.99} duration={500} precision={3} />);

      expect(mockUseAnimatedPrice).toHaveBeenCalledWith({
        targetValue: 99.99,
        duration: 500,
        precision: 3,
      });
    });

    it('uses default duration and precision when not provided', () => {
      mockUseAnimatedPrice.mockReturnValue({
        value: 50.0,
        formattedValue: '50.00',
        isAnimating: false,
      });

      render(<AnimatedPrice value={50.0} />);

      expect(mockUseAnimatedPrice).toHaveBeenCalledWith({
        targetValue: 50.0,
        duration: 300,
        precision: 2,
      });
    });

    it('updates when value prop changes', () => {
      mockUseAnimatedPrice.mockReturnValue({
        value: 100.0,
        formattedValue: '100.00',
        isAnimating: false,
      });

      const { rerender } = render(<AnimatedPrice value={100.0} />);

      expect(mockUseAnimatedPrice).toHaveBeenCalledWith({
        targetValue: 100.0,
        duration: 300,
        precision: 2,
      });

      rerender(<AnimatedPrice value={200.0} />);

      expect(mockUseAnimatedPrice).toHaveBeenCalledWith({
        targetValue: 200.0,
        duration: 300,
        precision: 2,
      });
    });
  });

  describe('Animation States', () => {
    it('handles animation transition correctly', async () => {
      mockUseAnimatedPrice.mockReturnValue({
        value: 150.75,
        formattedValue: '150.75',
        isAnimating: true,
      });

      const { rerender } = render(<AnimatedPrice value={150.75} />);

      let priceElement = screen.getByText('$150.75');
      expect(priceElement).toHaveClass('animating');

      mockUseAnimatedPrice.mockReturnValue({
        value: 150.75,
        formattedValue: '150.75',
        isAnimating: false,
      });

      rerender(<AnimatedPrice value={150.75} />);

      priceElement = screen.getByText('$150.75');
      expect(priceElement).not.toHaveClass('animating');
    });

    it('displays formatted value during animation', () => {
      mockUseAnimatedPrice.mockReturnValue({
        value: 75.5,
        formattedValue: '75.50',
        isAnimating: true,
      });

      render(<AnimatedPrice value={100.0} />);

      expect(screen.getByText('$75.50')).toBeInTheDocument();
    });
  });

  describe('Currency Formatting', () => {
    it('handles zero value correctly', () => {
      mockUseAnimatedPrice.mockReturnValue({
        value: 0,
        formattedValue: '0.00',
        isAnimating: false,
      });

      render(<AnimatedPrice value={0} />);

      expect(screen.getByText('$0.00')).toBeInTheDocument();
    });

    it('handles large values correctly', () => {
      mockUseAnimatedPrice.mockReturnValue({
        value: 9999.99,
        formattedValue: '9999.99',
        isAnimating: false,
      });

      render(<AnimatedPrice value={9999.99} />);

      expect(screen.getByText('$9999.99')).toBeInTheDocument();
    });

    it('handles different precision values', () => {
      mockUseAnimatedPrice.mockReturnValue({
        value: 123.456,
        formattedValue: '123.456',
        isAnimating: false,
      });

      render(<AnimatedPrice value={123.456} precision={3} />);

      expect(screen.getByText('$123.456')).toBeInTheDocument();
    });
  });

  describe('Props Validation', () => {
    it('accepts all valid prop combinations', () => {
      mockUseAnimatedPrice.mockReturnValue({
        value: 299.99,
        formattedValue: '299.99',
        isAnimating: false,
      });

      render(
        <AnimatedPrice
          value={299.99}
          currency="£"
          className="premium-price"
          duration={1000}
          precision={2}
        />
      );

      const priceElement = screen.getByText('£299.99');
      expect(priceElement).toHaveClass('animated-price', 'premium-price');
      expect(mockUseAnimatedPrice).toHaveBeenCalledWith({
        targetValue: 299.99,
        duration: 1000,
        precision: 2,
      });
    });
  });
});
