import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { toast } from 'react-toastify';
import PromoCodeBanner from './PromoCodeBanner';
import { usePromoCode } from '../../hooks/usePromoCode';

jest.mock('../../hooks/usePromoCode', () => ({
  usePromoCode: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
  },
}));

const mockWriteText = jest.fn();
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
});

const mockUsePromoCode = usePromoCode as jest.MockedFunction<typeof usePromoCode>;
const mockToast = toast as jest.Mocked<typeof toast>;

describe('PromoCodeBanner', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockWriteText.mockResolvedValue(undefined);
  });

  it('renders loading state', () => {
    mockUsePromoCode.mockReturnValue({
      availablePromoCodes: [],
      isLoadingAvailable: true,
      availableError: null,
      activePromoCodes: [],
      promoCodeError: null,
      addPromoCode: jest.fn(),
      removePromoCode: jest.fn(),
      refreshAvailablePromoCodes: jest.fn(),
      updateActivePromoCodes: jest.fn(),
    });

    render(<PromoCodeBanner />);

    expect(screen.getByText('Current Delights & Sweet Deals')).toBeInTheDocument();
    expect(screen.getByText('Loading available discounts...')).toBeInTheDocument();
    expect(document.querySelector('.loading-spinner')).toBeInTheDocument();
  });

  it('renders error state when there are no promo codes and error exists', () => {
    mockUsePromoCode.mockReturnValue({
      availablePromoCodes: [],
      isLoadingAvailable: false,
      availableError: 'Failed to load promo codes',
      activePromoCodes: [],
      promoCodeError: null,
      addPromoCode: jest.fn(),
      removePromoCode: jest.fn(),
      refreshAvailablePromoCodes: jest.fn(),
      updateActivePromoCodes: jest.fn(),
    });

    render(<PromoCodeBanner />);

    expect(screen.getByText('Current Delights & Sweet Deals')).toBeInTheDocument();
    expect(screen.getByText('Unable to load promo codes at the moment')).toBeInTheDocument();
  });

  it('renders promo codes when available', () => {
    const mockPromoCodes = [
      {
        code: 'SAVE20',
        name: 'Save 20%',
        description: 'Get 20% off your order',
        discount: '20%',
        validUntil: '2024-12-31T23:59:59.000Z',
        isActive: true,
      },
      {
        code: 'FREESHIP',
        name: 'Free Shipping',
        description: 'Free shipping on all orders',
        discount: '5.00 USD',
        validUntil: undefined,
        isActive: true,
      },
    ];

    mockUsePromoCode.mockReturnValue({
      availablePromoCodes: mockPromoCodes,
      isLoadingAvailable: false,
      availableError: null,
      activePromoCodes: [],
      promoCodeError: null,
      addPromoCode: jest.fn(),
      removePromoCode: jest.fn(),
      refreshAvailablePromoCodes: jest.fn(),
      updateActivePromoCodes: jest.fn(),
    });

    render(<PromoCodeBanner />);

    expect(screen.getByText('Current Delights & Sweet Deals')).toBeInTheDocument();
    expect(screen.getByText('SAVE20')).toBeInTheDocument();
    expect(screen.getByText('FREESHIP')).toBeInTheDocument();
    expect(screen.getByText('Get 20% off your order')).toBeInTheDocument();
    expect(screen.getByText('Free shipping on all orders')).toBeInTheDocument();
    expect(screen.getByText('20%')).toBeInTheDocument();
    expect(screen.getByText('5.00 USD')).toBeInTheDocument();
  });

  it('formats and displays valid until date correctly', () => {
    const mockPromoCodes = [
      {
        code: 'SAVE20',
        name: 'Save 20%',
        description: 'Get 20% off your order',
        discount: '20%',
        validUntil: '2024-12-31T23:59:59.000Z',
        isActive: true,
      },
    ];

    mockUsePromoCode.mockReturnValue({
      availablePromoCodes: mockPromoCodes,
      isLoadingAvailable: false,
      availableError: null,
      activePromoCodes: [],
      promoCodeError: null,
      addPromoCode: jest.fn(),
      removePromoCode: jest.fn(),
      refreshAvailablePromoCodes: jest.fn(),
      updateActivePromoCodes: jest.fn(),
    });

    render(<PromoCodeBanner />);

    expect(screen.getByText(/Valid until Jan 1, 2025/)).toBeInTheDocument();
  });

  it('does not display valid until date when not provided', () => {
    const mockPromoCodes = [
      {
        code: 'FREESHIP',
        name: 'Free Shipping',
        description: 'Free shipping on all orders',
        discount: '5.00 USD',
        validUntil: undefined,
        isActive: true,
      },
    ];

    mockUsePromoCode.mockReturnValue({
      availablePromoCodes: mockPromoCodes,
      isLoadingAvailable: false,
      availableError: null,
      activePromoCodes: [],
      promoCodeError: null,
      addPromoCode: jest.fn(),
      removePromoCode: jest.fn(),
      refreshAvailablePromoCodes: jest.fn(),
      updateActivePromoCodes: jest.fn(),
    });

    render(<PromoCodeBanner />);

    expect(screen.queryByText(/Valid until/)).not.toBeInTheDocument();
  });

  it('handles invalid date format gracefully', () => {
    const mockPromoCodes = [
      {
        code: 'SAVE20',
        name: 'Save 20%',
        description: 'Get 20% off your order',
        discount: '20%',
        validUntil: 'invalid-date',
        isActive: true,
      },
    ];

    mockUsePromoCode.mockReturnValue({
      availablePromoCodes: mockPromoCodes,
      isLoadingAvailable: false,
      availableError: null,
      activePromoCodes: [],
      promoCodeError: null,
      addPromoCode: jest.fn(),
      removePromoCode: jest.fn(),
      refreshAvailablePromoCodes: jest.fn(),
      updateActivePromoCodes: jest.fn(),
    });

    render(<PromoCodeBanner />);

    expect(screen.getByText(/Valid until/)).toBeInTheDocument();
    expect(screen.getByText(/Invalid Date/)).toBeInTheDocument();
  });

  it('copies promo code to clipboard when copy button is clicked', async () => {
    const mockPromoCodes = [
      {
        code: 'SAVE20',
        name: 'Save 20%',
        description: 'Get 20% off your order',
        discount: '20%',
        isActive: true,
      },
    ];

    mockUsePromoCode.mockReturnValue({
      availablePromoCodes: mockPromoCodes,
      isLoadingAvailable: false,
      availableError: null,
      activePromoCodes: [],
      promoCodeError: null,
      addPromoCode: jest.fn(),
      removePromoCode: jest.fn(),
      refreshAvailablePromoCodes: jest.fn(),
      updateActivePromoCodes: jest.fn(),
    });

    render(<PromoCodeBanner />);

    const copyButton = screen.getByTitle('Copy code');
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith('SAVE20');
      expect(mockToast.success).toHaveBeenCalledWith('Promo code SAVE20 copied to clipboard!');
    });
  });

  it('renders multiple promo codes correctly', () => {
    const mockPromoCodes = [
      {
        code: 'SAVE20',
        name: 'Save 20%',
        description: 'Get 20% off your order',
        discount: '20%',
        isActive: true,
      },
      {
        code: 'FREESHIP',
        name: 'Free Shipping',
        description: 'Free shipping on all orders',
        discount: '5.00 USD',
        isActive: true,
      },
      {
        code: 'NEWUSER',
        name: 'New User Discount',
        description: 'Welcome discount for new users',
        discount: '10%',
        isActive: true,
      },
    ];

    mockUsePromoCode.mockReturnValue({
      availablePromoCodes: mockPromoCodes,
      isLoadingAvailable: false,
      availableError: null,
      activePromoCodes: [],
      promoCodeError: null,
      addPromoCode: jest.fn(),
      removePromoCode: jest.fn(),
      refreshAvailablePromoCodes: jest.fn(),
      updateActivePromoCodes: jest.fn(),
    });

    render(<PromoCodeBanner />);

    expect(screen.getAllByTitle('Copy code')).toHaveLength(3);
    expect(screen.getByText('SAVE20')).toBeInTheDocument();
    expect(screen.getByText('FREESHIP')).toBeInTheDocument();
    expect(screen.getByText('NEWUSER')).toBeInTheDocument();
  });

  it('displays error message but still shows promo codes when error exists but codes are available', () => {
    const mockPromoCodes = [
      {
        code: 'SAVE20',
        name: 'Save 20%',
        description: 'Get 20% off your order',
        discount: '20%',
        isActive: true,
      },
    ];

    mockUsePromoCode.mockReturnValue({
      availablePromoCodes: mockPromoCodes,
      isLoadingAvailable: false,
      availableError: 'Some error occurred',
      activePromoCodes: [],
      promoCodeError: null,
      addPromoCode: jest.fn(),
      removePromoCode: jest.fn(),
      refreshAvailablePromoCodes: jest.fn(),
      updateActivePromoCodes: jest.fn(),
    });

    render(<PromoCodeBanner />);

    expect(screen.getByText('Current Delights & Sweet Deals')).toBeInTheDocument();
    expect(screen.getByText('SAVE20')).toBeInTheDocument();
  });

  it('applies correct CSS classes to promo code elements', () => {
    const mockPromoCodes = [
      {
        code: 'SAVE20',
        name: 'Save 20%',
        description: 'Get 20% off your order',
        discount: '20%',
        isActive: true,
      },
    ];

    mockUsePromoCode.mockReturnValue({
      availablePromoCodes: mockPromoCodes,
      isLoadingAvailable: false,
      availableError: null,
      activePromoCodes: [],
      promoCodeError: null,
      addPromoCode: jest.fn(),
      removePromoCode: jest.fn(),
      refreshAvailablePromoCodes: jest.fn(),
      updateActivePromoCodes: jest.fn(),
    });

    const { container } = render(<PromoCodeBanner />);

    expect(container.querySelector('.promo-banner')).toBeInTheDocument();
    expect(container.querySelector('.promo-banner-header')).toBeInTheDocument();
    expect(container.querySelector('.promo-codes-flex')).toBeInTheDocument();
    expect(container.querySelector('.promo-code-card')).toBeInTheDocument();
    expect(container.querySelector('.promo-code-badge')).toBeInTheDocument();
    expect(container.querySelector('.promo-discount')).toBeInTheDocument();
    expect(container.querySelector('.copy-code-btn')).toBeInTheDocument();
  });
});
