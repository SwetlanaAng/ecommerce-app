import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';
import { BrowserRouter } from 'react-router-dom';
import { AppRouterPaths } from '../../routes/AppRouterPathsEnums';
import { useAuth } from '../../features/auth/hooks/useAuth';

jest.mock('../../features/auth/hooks/useAuth');

const mockedUseAuth = useAuth as jest.Mock;

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Footer component', () => {
  it('shows Main, Catalog, and Profile links when authenticated', () => {
    mockedUseAuth.mockReturnValue({ isAuthenticated: true });

    renderWithRouter(<Footer />);

    expect(screen.getByText('Main')).toHaveAttribute('href', AppRouterPaths.MAIN);
    expect(screen.getByText('Catalog')).toHaveAttribute('href', AppRouterPaths.CATALOG);
    expect(screen.getByText('Profile')).toHaveAttribute('href', AppRouterPaths.PROFILE);
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
    expect(screen.queryByText('Register')).not.toBeInTheDocument();
  });

  it('shows Main, Catalog, Register, and Login links when not authenticated', () => {
    mockedUseAuth.mockReturnValue({ isAuthenticated: false });

    renderWithRouter(<Footer />);

    expect(screen.getByText('Main')).toHaveAttribute('href', AppRouterPaths.MAIN);
    expect(screen.getByText('Catalog')).toHaveAttribute('href', AppRouterPaths.CATALOG);
    expect(screen.getByText('Register')).toHaveAttribute('href', AppRouterPaths.REGISTER);
    expect(screen.getByText('Login')).toHaveAttribute('href', AppRouterPaths.LOGIN);
    expect(screen.queryByText('Profile')).not.toBeInTheDocument();
  });

  it('displays contact info and logo', () => {
    mockedUseAuth.mockReturnValue({ isAuthenticated: false });

    renderWithRouter(<Footer />);

    expect(screen.getByText('info@macarons-shop.com')).toBeInTheDocument();
    expect(screen.getByAltText('logo')).toBeInTheDocument();
  });
});
