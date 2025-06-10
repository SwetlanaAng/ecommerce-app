import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'react-toastify';
import PromoCode from './PromoCode';
import { useCartWithPromoCodes } from '../../hooks/useCartWithPromoCodes';

jest.mock('../../hooks/useCartWithPromoCodes', () => ({
  useCartWithPromoCodes: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('../../assets/arrow.svg', () => 'mock-arrow.svg');

const mockUseCartWithPromoCodes = useCartWithPromoCodes as jest.MockedFunction<
  typeof useCartWithPromoCodes
>;
const mockToast = toast as jest.Mocked<typeof toast>;

describe('PromoCode', () => {
  const mockAddPromoCode = jest.fn();
  const mockRemovePromoCode = jest.fn();

  const createMockCartHook = (overrides = {}) => ({
    cart: null,
    cartItemsCount: 0,
    isLoading: false,
    error: null,
    addToCart: jest.fn(),
    removeFromCart: jest.fn(),
    updateCartItemQuantity: jest.fn(),
    clearCart: jest.fn(),
    refreshCart: jest.fn().mockResolvedValue(undefined),
    setCart: jest.fn(),
    activePromoCodes: [],
    promoCodeError: null,
    addPromoCode: mockAddPromoCode,
    removePromoCode: mockRemovePromoCode,
    ...overrides,
  });

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseCartWithPromoCodes.mockReturnValue(createMockCartHook());
  });

  it('renders promo code form with input and submit button', () => {
    render(<PromoCode />);

    expect(screen.getByLabelText('Promo code')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /arrow/i })).toBeInTheDocument();
    expect(document.querySelector('form')).toBeInTheDocument();
  });

  it('updates input value when user types', async () => {
    const user = userEvent.setup();
    render(<PromoCode />);

    const input = screen.getByLabelText('Promo code');
    await user.type(input, 'SAVE20');

    expect(input).toHaveValue('SAVE20');
  });

  it('submit button is disabled when input is empty', () => {
    render(<PromoCode />);

    const submitButton = screen.getByRole('button', { name: /arrow/i });
    expect(submitButton).toBeDisabled();
  });

  it('submit button is enabled when input has valid promo code', async () => {
    const user = userEvent.setup();
    render(<PromoCode />);

    const input = screen.getByLabelText('Promo code');
    const submitButton = screen.getByRole('button', { name: /arrow/i });

    await user.type(input, 'SAVE20');
    expect(submitButton).toBeEnabled();
  });

  it('submit button is disabled when input contains only whitespace', async () => {
    const user = userEvent.setup();
    render(<PromoCode />);

    const input = screen.getByLabelText('Promo code');
    const submitButton = screen.getByRole('button', { name: /arrow/i });

    await user.type(input, '   ');
    expect(submitButton).toBeDisabled();
  });

  it('submits promo code successfully and shows success toast', async () => {
    const user = userEvent.setup();
    mockAddPromoCode.mockResolvedValueOnce(true);

    render(<PromoCode />);

    const input = screen.getByLabelText('Promo code');
    const submitButton = screen.getByRole('button', { name: /arrow/i });

    await user.type(input, 'SAVE20');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockAddPromoCode).toHaveBeenCalledWith('SAVE20');
      expect(mockToast.success).toHaveBeenCalledWith('Promo code "SAVE20" applied successfully!');
    });

    expect(input).toHaveValue('');
  });

  it('shows loading state during submission', async () => {
    const user = userEvent.setup();
    mockAddPromoCode.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(true), 100))
    );

    render(<PromoCode />);

    const input = screen.getByLabelText('Promo code');
    const submitButton = screen.getByRole('button', { name: /arrow/i });

    await user.type(input, 'SAVE20');
    await user.click(submitButton);

    expect(screen.getByText('...')).toBeInTheDocument();
    expect(input).toBeDisabled();
    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      expect(screen.queryByText('...')).not.toBeInTheDocument();
    });
  });

  it('handles failed promo code submission and shows error toast', async () => {
    const user = userEvent.setup();
    mockAddPromoCode.mockResolvedValueOnce(false);

    render(<PromoCode />);

    const input = screen.getByLabelText('Promo code');
    const submitButton = screen.getByRole('button', { name: /arrow/i });

    await user.type(input, 'INVALID');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockAddPromoCode).toHaveBeenCalledWith('INVALID');
      expect(mockToast.error).toHaveBeenCalledWith(
        'Promo code "INVALID" is not applicable to items in your cart'
      );
    });
  });

  it('shows promo code error from hook and displays error toast', () => {
    mockUseCartWithPromoCodes.mockReturnValue(
      createMockCartHook({
        promoCodeError: 'Failed to add promo code',
      })
    );

    render(<PromoCode />);

    expect(mockToast.error).toHaveBeenCalledWith('Failed to add promo code');
  });

  it('does not show additional error toast when hook error exists and submission fails', async () => {
    const user = userEvent.setup();
    mockAddPromoCode.mockResolvedValueOnce(false);
    mockUseCartWithPromoCodes.mockReturnValue(
      createMockCartHook({
        promoCodeError: 'Failed to add promo code',
      })
    );

    render(<PromoCode />);

    const input = screen.getByLabelText('Promo code');
    const submitButton = screen.getByRole('button', { name: /arrow/i });

    await user.type(input, 'INVALID');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockAddPromoCode).toHaveBeenCalledWith('INVALID');
    });

    expect(mockToast.error).toHaveBeenCalledTimes(1);
    expect(mockToast.error).toHaveBeenCalledWith('Failed to add promo code');
  });

  it('displays active promo codes', () => {
    const activePromoCodes = [
      { id: 'promo1', name: 'Save 20%', code: 'SAVE20' },
      { id: 'promo2', name: 'Free Shipping', code: 'FREESHIP' },
    ];

    mockUseCartWithPromoCodes.mockReturnValue(
      createMockCartHook({
        activePromoCodes,
      })
    );

    render(<PromoCode />);

    expect(screen.getByText('Save 20%')).toBeInTheDocument();
    expect(screen.getByText('Free Shipping')).toBeInTheDocument();
    expect(screen.getAllByTitle('Remove promo code')).toHaveLength(2);
  });

  it('displays promo code fallback when name is not available', () => {
    const activePromoCodes = [{ id: 'promo1', code: 'SAVE20' }, { id: 'promo2' }];

    mockUseCartWithPromoCodes.mockReturnValue(
      createMockCartHook({
        activePromoCodes,
      })
    );

    render(<PromoCode />);

    expect(screen.getByText('SAVE20')).toBeInTheDocument();
    expect(screen.getByText('promo2...')).toBeInTheDocument();
  });

  it('removes promo code when remove button is clicked', async () => {
    const user = userEvent.setup();
    const activePromoCodes = [{ id: 'promo1', name: 'Save 20%', code: 'SAVE20' }];

    mockUseCartWithPromoCodes.mockReturnValue(
      createMockCartHook({
        activePromoCodes,
      })
    );

    render(<PromoCode />);

    const removeButton = screen.getByTitle('Remove promo code');
    await user.click(removeButton);

    await waitFor(() => {
      expect(mockRemovePromoCode).toHaveBeenCalledWith('promo1');
      expect(mockToast.success).toHaveBeenCalledWith('Promo code removed successfully!');
    });
  });

  it('does not display active promo codes section when no codes are active', () => {
    render(<PromoCode />);

    expect(screen.queryByText('×')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Remove promo code')).not.toBeInTheDocument();
  });

  it('prevents form submission when input is empty', async () => {
    render(<PromoCode />);

    const form = document.querySelector('form') as HTMLFormElement;
    fireEvent.submit(form);

    expect(mockAddPromoCode).not.toHaveBeenCalled();
  });

  it('trims whitespace from promo code input', async () => {
    const user = userEvent.setup();
    mockAddPromoCode.mockResolvedValueOnce(true);

    render(<PromoCode />);

    const input = screen.getByLabelText('Promo code');
    const submitButton = screen.getByRole('button', { name: /arrow/i });

    await user.type(input, '  SAVE20  ');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockAddPromoCode).toHaveBeenCalledWith('SAVE20');
    });
  });

  it('applies correct CSS classes', () => {
    const activePromoCodes = [{ id: 'promo1', name: 'Save 20%', code: 'SAVE20' }];

    mockUseCartWithPromoCodes.mockReturnValue(
      createMockCartHook({
        activePromoCodes,
      })
    );

    const { container } = render(<PromoCode />);

    expect(container.querySelector('.promo-code-section')).toBeInTheDocument();
    expect(container.querySelector('.promo-code-form')).toBeInTheDocument();
    expect(container.querySelector('.promo-code-input-group')).toBeInTheDocument();
    expect(container.querySelector('.promo-code-input')).toBeInTheDocument();
    expect(container.querySelector('.promo-code-submit')).toBeInTheDocument();
    expect(container.querySelector('.active-promo-codes')).toBeInTheDocument();
    expect(container.querySelector('.active-promo-code.applied')).toBeInTheDocument();
    expect(container.querySelector('.remove-promo-btn')).toBeInTheDocument();
  });
});
