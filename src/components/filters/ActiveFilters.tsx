import React from 'react';
import { ProductFilters } from '../../types/interfaces';
import './FilterPanel.css';

interface ActiveFiltersProps {
  filters: ProductFilters & { categoryName?: string };
  onRemoveFilter: (filterType: string, value?: string) => void;
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({ filters, onRemoveFilter }) => {
  const hasActiveFilters =
    (filters.flavors && filters.flavors.length > 0) ||
    filters.isBestSeller ||
    filters.isGlutenFree ||
    filters.priceRange?.min !== undefined ||
    filters.priceRange?.max !== undefined ||
    filters.categoryName !== undefined;

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <div className="active-filters">
      {filters.categoryName && (
        <div className="active-filter-tag">
          Category: {filters.categoryName}
          <button onClick={() => onRemoveFilter('category')}>×</button>
        </div>
      )}

      {filters.priceRange?.min !== undefined && (
        <div className="active-filter-tag">
          Min Price: ${filters.priceRange.min}
          <button onClick={() => onRemoveFilter('minPrice')}>×</button>
        </div>
      )}

      {filters.priceRange?.max !== undefined && (
        <div className="active-filter-tag">
          Max Price: ${filters.priceRange.max}
          <button onClick={() => onRemoveFilter('maxPrice')}>×</button>
        </div>
      )}

      {filters.flavors && filters.flavors.length > 0 && (
        <div className="active-filter-tag">
          Flavor: {capitalizeFirstLetter(filters.flavors[0])}
          <button onClick={() => onRemoveFilter('flavor')}>×</button>
        </div>
      )}

      {filters.isBestSeller && (
        <div className="active-filter-tag">
          Best Seller
          <button onClick={() => onRemoveFilter('isBestSeller')}>×</button>
        </div>
      )}

      {filters.isGlutenFree && (
        <div className="active-filter-tag">
          Gluten Free
          <button onClick={() => onRemoveFilter('isGlutenFree')}>×</button>
        </div>
      )}

      <div className="active-filter-tag clear-all">
        <button onClick={() => onRemoveFilter('all')}>Clear All</button>
      </div>
    </div>
  );
};

export default ActiveFilters;
