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

jest.mock('../../services/cart.logic', () => ({
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
    mockedUseAuth.mockReturnValue({
      isAuthenticated: true,
      logout: jest.fn(),
      user: { firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
    });

    renderHeader();

    expect(screen.getByAltText(/profile/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/profile menu/i)).toBeInTheDocument();

    expect(screen.queryByAltText(/logout/i)).not.toBeInTheDocument();
  });

  it('shows profile dropdown when profile button is clicked', () => {
    mockedUseAuth.mockReturnValue({
      isAuthenticated: true,
      logout: jest.fn(),
      user: { firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
    });

    renderHeader();

    const profileButton = screen.getByLabelText(/profile menu/i);
    fireEvent.click(profileButton);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText(/account settings/i)).toBeInTheDocument();
    expect(screen.getByText(/sign out/i)).toBeInTheDocument();
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

  it('calls logout and navigates on logout button click in dropdown', () => {
    const mockLogout = jest.fn();
    mockedUseAuth.mockReturnValue({
      isAuthenticated: true,
      logout: mockLogout,
      user: { firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
    });

    renderHeader();

    const profileButton = screen.getByLabelText(/profile menu/i);
    fireEvent.click(profileButton);

    const logoutButton = screen.getByText(/sign out/i);
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalled();
  });

  it('closes profile dropdown when clicking outside', () => {
    mockedUseAuth.mockReturnValue({
      isAuthenticated: true,
      logout: jest.fn(),
      user: { firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
    });

    renderHeader();

    const profileButton = screen.getByLabelText(/profile menu/i);
    fireEvent.click(profileButton);
    expect(screen.getByText('John Doe')).toBeInTheDocument();

    fireEvent.mouseDown(document.body);

    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
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

  it('displays user name correctly when user has first and last name', () => {
    mockedUseAuth.mockReturnValue({
      isAuthenticated: true,
      logout: jest.fn(),
      user: { firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
    });

    renderHeader();

    const profileButton = screen.getByLabelText(/profile menu/i);
    fireEvent.click(profileButton);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('displays fallback name when user has only email', () => {
    mockedUseAuth.mockReturnValue({
      isAuthenticated: true,
      logout: jest.fn(),
      user: { email: 'john@example.com' },
    });

    renderHeader();

    const profileButton = screen.getByLabelText(/profile menu/i);
    fireEvent.click(profileButton);

    const profileElements = screen.getAllByText('john@example.com');
    expect(profileElements).toHaveLength(2);
  });
});
