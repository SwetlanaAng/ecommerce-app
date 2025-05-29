import { render, screen, fireEvent } from '@testing-library/react';
import FilterPanel from './FilterPanel';
import { useAppContext } from '../../features/app/hooks/useAppContext';

jest.mock('../../features/app/hooks/useAppContext');

const mockedUseAppContext = useAppContext as jest.MockedFunction<typeof useAppContext>;

describe('FilterPanel', () => {
  const availableFlavors = ['chocolate', 'vanilla', 'strawberry'];
  const priceRange = { min: 10, max: 100 };
  const baseFilters = {
    flavors: [],
    isBestSeller: false,
    priceRange: { min: 10, max: 100 },
  };

  const onFilterChange = jest.fn();
  const onResetFilters = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseAppContext.mockReturnValue({
      availableFlavors,
      priceRange,
      isLoading: false,
      categories: [],
      error: null,
    });
  });

  it('renders correctly with initial props', () => {
    render(
      <FilterPanel
        filters={baseFilters}
        onFilterChange={onFilterChange}
        onResetFilters={onResetFilters}
      />
    );

    expect(screen.getByText('Filters')).toBeInTheDocument();

    const allFlavorsCheckbox = screen.getByLabelText('All Flavors') as HTMLInputElement;
    expect(allFlavorsCheckbox).toBeInTheDocument();
    expect(allFlavorsCheckbox.checked).toBe(true);

    availableFlavors.forEach(flavor => {
      const checkbox = screen.getByLabelText(flavor.charAt(0).toUpperCase() + flavor.slice(1));
      expect(checkbox).toBeInTheDocument();
      expect((checkbox as HTMLInputElement).checked).toBe(false);
    });

    expect(screen.getByLabelText('Min:')).toHaveValue(priceRange.min);
    expect(screen.getByLabelText('Max:')).toHaveValue(priceRange.max);

    expect(screen.getByText('Apply')).toBeInTheDocument();

    const bestSellerCheckbox = screen.getByLabelText('Best Seller') as HTMLInputElement;
    expect(bestSellerCheckbox.checked).toBe(false);
  });

  it('calls onFilterChange when flavor is selected', () => {
    render(
      <FilterPanel
        filters={baseFilters}
        onFilterChange={onFilterChange}
        onResetFilters={onResetFilters}
      />
    );

    const chocolateCheckbox = screen.getByLabelText('Chocolate');
    fireEvent.click(chocolateCheckbox);

    expect(onFilterChange).toHaveBeenCalledWith({
      ...baseFilters,
      flavors: ['chocolate'],
    });
  });

  it('calls onFilterChange when Best Seller checkbox changes', () => {
    render(
      <FilterPanel
        filters={baseFilters}
        onFilterChange={onFilterChange}
        onResetFilters={onResetFilters}
      />
    );

    const bestSellerCheckbox = screen.getByLabelText('Best Seller');
    fireEvent.click(bestSellerCheckbox);

    expect(onFilterChange).toHaveBeenCalledWith({
      ...baseFilters,
      isBestSeller: true,
    });
  });

  it('updates price inputs and applies price filter', () => {
    render(
      <FilterPanel
        filters={baseFilters}
        onFilterChange={onFilterChange}
        onResetFilters={onResetFilters}
      />
    );

    const minPriceInput = screen.getByLabelText('Min:');
    const maxPriceInput = screen.getByLabelText('Max:');
    const applyButton = screen.getByText('Apply');

    fireEvent.change(minPriceInput, { target: { value: '20' } });
    expect(minPriceInput).toHaveValue(20);

    fireEvent.change(maxPriceInput, { target: { value: '80' } });
    expect(maxPriceInput).toHaveValue(80);

    fireEvent.click(applyButton);

    expect(onFilterChange).toHaveBeenCalledWith({
      ...baseFilters,
      priceRange: {
        min: 20,
        max: 80,
      },
    });
  });

  it('calls onResetFilters and resets price inputs on Reset All click', () => {
    render(
      <FilterPanel
        filters={{ ...baseFilters, priceRange: { min: 20, max: 80 } }}
        onFilterChange={onFilterChange}
        onResetFilters={onResetFilters}
      />
    );

    const minPriceInput = screen.getByLabelText('Min:');
    const maxPriceInput = screen.getByLabelText('Max:');
    const resetButton = screen.getByText('Reset All');

    expect(minPriceInput).toHaveValue(20);
    expect(maxPriceInput).toHaveValue(80);

    fireEvent.click(resetButton);

    expect(onResetFilters).toHaveBeenCalled();

    expect(minPriceInput).toHaveValue(10);
    expect(maxPriceInput).toHaveValue(100);
  });

  it('renders loading state when isLoading is true', () => {
    mockedUseAppContext.mockReturnValue({
      availableFlavors,
      priceRange,
      isLoading: true,
      categories: [],
      error: null,
    });

    render(
      <FilterPanel
        filters={baseFilters}
        onFilterChange={onFilterChange}
        onResetFilters={onResetFilters}
      />
    );

    expect(screen.getByText('Loading filters...')).toBeInTheDocument();
  });
});
