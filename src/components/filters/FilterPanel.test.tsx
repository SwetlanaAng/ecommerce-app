import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useState } from 'react';
import FilterPanel from './FilterPanel';
import { useAppContext } from '../../features/app/hooks/useAppContext';
import { ProductFilters } from '../../types/interfaces';

jest.mock('../../features/app/hooks/useAppContext');

const mockedUseAppContext = useAppContext as jest.MockedFunction<typeof useAppContext>;

const availableFlavors = ['chocolate', 'vanilla', 'strawberry'];
const priceRange = { min: 10, max: 100 };
const baseFilters: ProductFilters = {
  flavors: [],
  isBestSeller: false,
  isGlutenFree: false,
  priceRange: { min: 10, max: 100 },
};

interface FilterPanelTestWrapperProps {
  initialFilters: ProductFilters;
}

const FilterPanelTestWrapper = ({ initialFilters }: FilterPanelTestWrapperProps) => {
  const [filters, setFilters] = useState(initialFilters);

  const handleFilterChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters(baseFilters);
  };

  return (
    <FilterPanel
      filters={filters}
      onFilterChange={handleFilterChange}
      onResetFilters={handleResetFilters}
    />
  );
};

describe('FilterPanel', () => {
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
    render(<FilterPanelTestWrapper initialFilters={baseFilters} />);

    expect(screen.getByText('Filters')).toBeInTheDocument();

    const allFlavorsCheckbox = screen.getByLabelText('All Flavors') as HTMLInputElement;
    expect(allFlavorsCheckbox).toBeInTheDocument();
    expect(allFlavorsCheckbox.checked).toBe(true);

    availableFlavors.forEach(flavor => {
      const checkbox = screen.getByLabelText(flavor.charAt(0).toUpperCase() + flavor.slice(1));
      expect(checkbox).toBeInTheDocument();
      expect((checkbox as HTMLInputElement).checked).toBe(false);
    });

    expect(screen.getByLabelText('from')).toHaveValue(priceRange.min);
    expect(screen.getByLabelText('to')).toHaveValue(priceRange.max);

    const bestSellerCheckbox = screen.getByLabelText('Best Seller') as HTMLInputElement;
    expect(bestSellerCheckbox.checked).toBe(false);
  });

  it('calls onFilterChange when flavor is selected', async () => {
    render(<FilterPanelTestWrapper initialFilters={baseFilters} />);

    const chocolateCheckbox = screen.getByLabelText('Chocolate');
    fireEvent.click(chocolateCheckbox);

    await waitFor(() => {
      expect((screen.getByLabelText('Chocolate') as HTMLInputElement).checked).toBe(true);
    });
  });

  it('calls onFilterChange when Best Seller checkbox changes', async () => {
    render(<FilterPanelTestWrapper initialFilters={baseFilters} />);

    const bestSellerCheckbox = screen.getByLabelText('Best Seller');
    fireEvent.click(bestSellerCheckbox);

    await waitFor(() => {
      expect((screen.getByLabelText('Best Seller') as HTMLInputElement).checked).toBe(true);
    });
  });

  it('updates price inputs and applies price filter', async () => {
    render(<FilterPanelTestWrapper initialFilters={baseFilters} />);

    const minPriceInput = screen.getByLabelText('from');
    const maxPriceInput = screen.getByLabelText('to');

    fireEvent.change(minPriceInput, { target: { value: '20' } });
    await waitFor(() => {
      expect(minPriceInput).toHaveValue(20);
    });

    fireEvent.change(maxPriceInput, { target: { value: '80' } });
    await waitFor(() => {
      expect(maxPriceInput).toHaveValue(80);
    });
  });

  it('calls onResetFilters and resets price inputs on Reset All click', async () => {
    render(
      <FilterPanelTestWrapper
        initialFilters={{ ...baseFilters, priceRange: { min: 20, max: 80 } }}
      />
    );

    const minPriceInput = screen.getByLabelText('from');
    const maxPriceInput = screen.getByLabelText('to');
    const resetButton = screen.getByText('Reset All');

    expect(minPriceInput).toHaveValue(20);
    expect(maxPriceInput).toHaveValue(80);

    fireEvent.click(resetButton);

    await waitFor(() => {
      expect(minPriceInput).toHaveValue(10);
      expect(maxPriceInput).toHaveValue(100);
    });
  });

  it('renders loading state when isLoading is true', () => {
    mockedUseAppContext.mockReturnValue({
      availableFlavors,
      priceRange,
      isLoading: true,
      categories: [],
      error: null,
    });

    render(<FilterPanelTestWrapper initialFilters={baseFilters} />);

    expect(screen.getByText('Loading filters...')).toBeInTheDocument();
  });
});
