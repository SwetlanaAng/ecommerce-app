import { render, screen, fireEvent, within } from '@testing-library/react';
import ActiveFilters from './ActiveFilters';
import { ProductFilters } from '../../types/interfaces';

describe('ActiveFilters', () => {
  const setup = (filters: ProductFilters & { categoryName?: string }) => {
    const onRemoveFilter = jest.fn();
    render(<ActiveFilters filters={filters} onRemoveFilter={onRemoveFilter} />);
    return { onRemoveFilter };
  };

  it('does not render when there are no active filters', () => {
    const filters: ProductFilters = {
      flavors: [],
      priceRange: {},
      isBestSeller: false,
    };

    const { container } = render(<ActiveFilters filters={filters} onRemoveFilter={jest.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders all active filters correctly', () => {
    const filters: ProductFilters & { categoryName: string } = {
      flavors: ['vanilla'],
      priceRange: { min: 5, max: 20 },
      isBestSeller: true,
      categoryName: 'Gift Boxes',
    };

    setup(filters);

    expect(screen.getByText(/Category: Gift Boxes/)).toBeInTheDocument();
    expect(screen.getByText(/Min Price: \$5/)).toBeInTheDocument();
    expect(screen.getByText(/Max Price: \$20/)).toBeInTheDocument();
    expect(screen.getByText(/Flavor: Vanilla/)).toBeInTheDocument();
    expect(screen.getByText(/Best Seller/)).toBeInTheDocument();
    expect(screen.getByText(/Clear All/)).toBeInTheDocument();
  });

  it('calls onRemoveFilter with correct arguments when buttons are clicked', () => {
    const filters: ProductFilters & { categoryName: string } = {
      flavors: ['chocolate'],
      priceRange: { min: 10 },
      isBestSeller: false,
      categoryName: 'Specials',
    };

    const { onRemoveFilter } = setup(filters);

    fireEvent.click(
      within(screen.getByText(/Category: Specials/).closest('.active-filter-tag')!).getByRole(
        'button'
      )
    );
    expect(onRemoveFilter).toHaveBeenCalledWith('category');

    fireEvent.click(
      within(screen.getByText(/Min Price: \$10/).closest('.active-filter-tag')!).getByRole('button')
    );
    expect(onRemoveFilter).toHaveBeenCalledWith('minPrice');

    fireEvent.click(
      within(screen.getByText(/Flavor: Chocolate/).closest('.active-filter-tag')!).getByRole(
        'button'
      )
    );
    expect(onRemoveFilter).toHaveBeenCalledWith('flavor', 'chocolate');

    fireEvent.click(screen.getByText(/Clear All/));
    expect(onRemoveFilter).toHaveBeenCalledWith('all');
  });

  it('calls onRemoveFilter for isBestSeller', () => {
    const filters: ProductFilters = {
      flavors: [],
      priceRange: {},
      isBestSeller: true,
    };

    const { onRemoveFilter } = setup(filters);
    fireEvent.click(
      within(screen.getByText(/Best Seller/).closest('.active-filter-tag')!).getByRole('button')
    );
    expect(onRemoveFilter).toHaveBeenCalledWith('isBestSeller');
  });

  it('renders multiple flavors as separate tags and allows individual removal', () => {
    const filters: ProductFilters = {
      flavors: ['chocolate', 'vanilla', 'strawberry'],
      priceRange: {},
      isBestSeller: false,
    };

    const { onRemoveFilter } = setup(filters);

    expect(screen.getByText(/Flavor: Chocolate/)).toBeInTheDocument();
    expect(screen.getByText(/Flavor: Vanilla/)).toBeInTheDocument();
    expect(screen.getByText(/Flavor: Strawberry/)).toBeInTheDocument();

    fireEvent.click(
      within(screen.getByText(/Flavor: Vanilla/).closest('.active-filter-tag')!).getByRole('button')
    );
    expect(onRemoveFilter).toHaveBeenCalledWith('flavor', 'vanilla');
  });
});
