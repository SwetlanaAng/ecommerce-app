import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './Header';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { useCart } from '../../features/cart/hooks/useCart';

jest.mock('../../assets/logo.svg', () => 'logo.svg');
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

jest.mock('../../features/auth/hooks/useAuth');
jest.mock('../../features/cart/hooks/useCart');

const mockedUseAuth = useAuth as jest.Mock;
const mockedUseCart = useCart as jest.Mock;

const renderHeader = () => {
  return render(
    <Router>
      <Header />
    </Router>
  );
};

describe('Header component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseCart.mockReturnValue({
      cartItemsCount: 2,
      cart: null,
      addToCart: jest.fn(),
    });
  });

  it('renders correctly for unauthenticated users', () => {
    mockedUseAuth.mockReturnValue({ isAuthenticated: false });

    renderHeader();

    expect(screen.getByAltText(/logo/i)).toBeInTheDocument();
    expect(screen.getByText(/main/i)).toBeInTheDocument();
    expect(screen.getByText(/catalog/i)).toBeInTheDocument();
    expect(screen.getByText(/register/i)).toBeInTheDocument();
    expect(screen.getByText(/about/i)).toBeInTheDocument();
    expect(screen.getByTitle(/cart/i)).toBeInTheDocument();
    expect(screen.getByAltText(/login/i)).toBeInTheDocument();
  });

  it('renders correctly for authenticated users', () => {
    mockedUseAuth.mockReturnValue({ isAuthenticated: true, logout: jest.fn() });

    renderHeader();

    expect(screen.getByAltText(/profile/i)).toBeInTheDocument();
    expect(screen.getByAltText(/logout/i)).toBeInTheDocument();
  });

  it('toggles mobile menu on hamburger click', () => {
    mockedUseAuth.mockReturnValue({ isAuthenticated: false });

    renderHeader();

    const hamburger =
      screen.getByRole('button', { hidden: true }) ||
      screen.getByText('', { selector: '.hamburger' });
    fireEvent.click(hamburger);

    const nav = screen.getByRole('navigation');
    expect(nav.className).toContain('active');
  });

  it('calls logout and navigates on logout link click', () => {
    const mockLogout = jest.fn();
    mockedUseAuth.mockReturnValue({ isAuthenticated: true, logout: mockLogout });

    renderHeader();

    const logoutLink = screen.getByAltText(/logout/i);
    fireEvent.click(logoutLink);

    expect(mockLogout).toHaveBeenCalled();
  });

  it('closes mobile menu when a link is clicked', () => {
    mockedUseAuth.mockReturnValue({ isAuthenticated: false });

    renderHeader();

    const hamburger =
      screen.getByRole('button', { hidden: true }) ||
      screen.getByText('', { selector: '.hamburger' });
    fireEvent.click(hamburger);

    const catalogLink = screen.getByText(/catalog/i);
    fireEvent.click(catalogLink);

    const nav = screen.getByRole('navigation');
    expect(nav.className).not.toContain('active');
  });

  it('displays cart icon with correct count', () => {
    mockedUseAuth.mockReturnValue({ isAuthenticated: false });
    mockedUseCart.mockReturnValue({
      cartItemsCount: 5,
      cart: null,
      addToCart: jest.fn(),
    });

    renderHeader();

    const cartIcon = screen.getByTitle(/cart/i);
    expect(cartIcon).toBeInTheDocument();
  });
});
