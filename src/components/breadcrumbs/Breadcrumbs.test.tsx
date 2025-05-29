import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Breadcrumbs from './Breadcrumbs';
import { BrowserRouter } from 'react-router-dom';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    ...originalModule,
    useNavigate: () => mockNavigate,
  };
});

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Breadcrumbs component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders Main and Catalog links by default', () => {
    renderWithRouter(<Breadcrumbs />);
    expect(screen.getByText('Main')).toBeInTheDocument();
    expect(screen.getByText('Catalog')).toBeInTheDocument();
  });

  it('navigates to "/" when Main is clicked', () => {
    renderWithRouter(<Breadcrumbs />);
    fireEvent.click(screen.getByText('Main'));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('navigates to "/catalog" when Catalog is clicked', () => {
    renderWithRouter(<Breadcrumbs />);
    fireEvent.click(screen.getByText('Catalog'));
    expect(mockNavigate).toHaveBeenCalledWith('/catalog');
  });

  it('renders category path if provided', () => {
    const path = [
      { id: '1', name: 'Sweets' },
      { id: '2', name: 'Macarons' },
    ];
    renderWithRouter(<Breadcrumbs categoryPath={path} />);

    expect(screen.getByText('Sweets')).toBeInTheDocument();
    expect(screen.getByText('Macarons')).toBeInTheDocument();
  });

  it('calls navigate with category id when category item is clicked', () => {
    const path = [{ id: '1', name: 'Sweets' }];
    renderWithRouter(<Breadcrumbs categoryPath={path} />);

    fireEvent.click(screen.getByText('Sweets'));
    expect(mockNavigate).toHaveBeenCalledWith('/catalog?category=1');
  });

  it('renders currentCategory as active breadcrumb if provided', () => {
    renderWithRouter(<Breadcrumbs currentCategory="Vanilla Macarons" />);
    const current = screen.getByText('Vanilla Macarons');
    expect(current).toBeInTheDocument();
    expect(current).toHaveClass('breadcrumb-item active');
  });
});
