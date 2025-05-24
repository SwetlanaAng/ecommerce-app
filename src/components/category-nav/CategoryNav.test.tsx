import { render, screen, fireEvent } from '@testing-library/react';
import CategoryNav from './CategoryNav';
import { useAppContext } from '../../features/app/hooks/useAppContext';
import { CategoryWithChildren } from '../../types/interfaces';

jest.mock('../../features/app/hooks/useAppContext');

const mockUseAppContext = useAppContext as jest.MockedFunction<typeof useAppContext>;

const mockCategories: CategoryWithChildren[] = [
  {
    id: 'cat-1',
    name: { 'en-US': 'Fruits' },
    children: [
      {
        id: 'cat-1-1',
        name: { 'en-US': 'Apples' },
        children: [],
      },
    ],
  },
  {
    id: 'cat-2',
    name: { 'en-US': 'Vegetables' },
    children: [],
  },
];

describe('CategoryNav', () => {
  it('displays loading message when loading', () => {
    mockUseAppContext.mockReturnValue({
      categories: [],
      isLoading: true,
      availableFlavors: [],
      priceRange: { min: 0, max: 0 },
      error: null,
    });
    render(<CategoryNav onSelectCategory={() => {}} />);
    expect(screen.getByText(/loading categories/i)).toBeInTheDocument();
  });

  it('renders category names', () => {
    mockUseAppContext.mockReturnValue({
      categories: mockCategories,
      isLoading: false,
      availableFlavors: [],
      priceRange: { min: 0, max: 0 },
      error: null,
    });
    render(<CategoryNav onSelectCategory={() => {}} />);
    expect(screen.getByText('Fruits')).toBeInTheDocument();
    expect(screen.getByText('Vegetables')).toBeInTheDocument();
  });

  it('calls onSelectCategory when a category is clicked', () => {
    const onSelectCategory = jest.fn();
    mockUseAppContext.mockReturnValue({
      categories: mockCategories,
      isLoading: false,
      availableFlavors: [],
      priceRange: { min: 0, max: 0 },
      error: null,
    });
    render(<CategoryNav onSelectCategory={onSelectCategory} />);
    fireEvent.click(screen.getByText('Vegetables'));
    expect(onSelectCategory).toHaveBeenCalledWith('cat-2');
  });

  it('expands and shows subcategories on toggle', () => {
    mockUseAppContext.mockReturnValue({
      categories: mockCategories,
      isLoading: false,
      availableFlavors: [],
      priceRange: { min: 0, max: 0 },
      error: null,
    });
    render(<CategoryNav onSelectCategory={() => {}} />);
    const expandButton = screen.getByRole('button', { name: /expand category/i });
    fireEvent.click(expandButton);
    expect(screen.getByText('Apples')).toBeInTheDocument();
  });

  it('highlights selected category', () => {
    mockUseAppContext.mockReturnValue({
      categories: mockCategories,
      isLoading: false,
      availableFlavors: [],
      priceRange: { min: 0, max: 0 },
      error: null,
    });
    render(<CategoryNav onSelectCategory={() => {}} selectedCategoryId="cat-1" />);
    expect(screen.getByText('Fruits')).toHaveClass('selected');
  });
});
