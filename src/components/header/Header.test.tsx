import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './Header';
import { useAuth } from '../../features/auth/hooks/useAuth';

jest.mock('../../assets/logo.svg', () => 'logo.svg');

jest.mock('../../features/auth/hooks/useAuth');

const mockedUseAuth = useAuth as jest.Mock;

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
  });

  it('renders correctly for unauthenticated users', () => {
    mockedUseAuth.mockReturnValue({ isAuthenticated: false });

    renderHeader();

    expect(screen.getByAltText(/logo/i)).toBeInTheDocument();
    expect(screen.getByText(/main/i)).toBeInTheDocument();
    expect(screen.getByText(/catalog/i)).toBeInTheDocument();
    expect(screen.getByText(/register/i)).toBeInTheDocument();
    expect(screen.getByText(/log in/i)).toBeInTheDocument();
  });

  it('renders correctly for authenticated users', () => {
    mockedUseAuth.mockReturnValue({ isAuthenticated: true, logout: jest.fn() });

    renderHeader();

    expect(screen.getByText(/profile/i)).toBeInTheDocument();
    expect(screen.getByText(/log out/i)).toBeInTheDocument();
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

    const logoutLink = screen.getByText(/log out/i);
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
});
