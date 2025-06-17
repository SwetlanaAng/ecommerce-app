import { render, screen, fireEvent } from '@testing-library/react';
import CategoryNav from './CategoryNav';
import { useAppContext } from '../../features/app/hooks/useAppContext';
import { CategoryWithChildren } from '../../types/interfaces';

jest.mock('../../features/app/hooks/useAppContext');

const mockUseAppContext = useAppContext as jest.MockedFunction<typeof useAppContext>;

const mockCategories: CategoryWithChildren[] = [
  {
    id: 'cat-1',
    name: { 'en-US': 'Packaging' },
    children: [
      {
        id: 'cat-1-1',
        name: { 'en-US': '6-pack' },
        children: [],
      },
    ],
  },
  {
    id: 'cat-2',
    name: { 'en-US': 'Special' },
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
    expect(screen.getByText('Packaging')).toBeInTheDocument();
    expect(screen.getByText('Special')).toBeInTheDocument();
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
    fireEvent.click(screen.getByText('Packaging'));
    expect(onSelectCategory).toHaveBeenCalledWith('cat-1');
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
    expect(screen.getByText('Packaging')).toHaveClass('selected');
  });
});
