import React, { useState } from 'react';
import { ProductFilters } from '../../types/interfaces';
import Input from '../input/Input';
import Button from '../button/Button';
import './FilterSidebar.css';

interface FilterSidebarProps {
  onFilterChange: (filters: ProductFilters) => void;
  categoryStructure: {
    [key: string]: string[];
  };
  initialFilters?: ProductFilters;
  onCategorySelect: (category: string) => void;
  selectedCategories: string[];
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  onFilterChange,
  categoryStructure,
  initialFilters = {},
  onCategorySelect,
  selectedCategories,
}) => {
  const [priceMin, setPriceMin] = useState<string>(
    initialFilters.priceRange?.min?.toString() || ''
  );
  const [priceMax, setPriceMax] = useState<string>(
    initialFilters.priceRange?.max?.toString() || ''
  );

  const handlePriceChange = () => {
    const min = priceMin ? parseFloat(priceMin) : undefined;
    const max = priceMax ? parseFloat(priceMax) : undefined;

    onFilterChange({
      ...initialFilters,
      priceRange: { min, max },
    });
  };

  const resetFilters = () => {
    onFilterChange({});
    setPriceMin('');
    setPriceMax('');
    onCategorySelect('');
  };

  const isFilterActive = () => {
    return selectedCategories.length > 0 || priceMin !== '' || priceMax !== '';
  };

  return (
    <div className="filter-sidebar">
      <div className="filter-section">
        <h4>Price Range</h4>
        <div className="price-range">
          <Input
            type="number"
            placeholder="Min"
            name="priceMin"
            id="priceMin"
            value={priceMin}
            onChange={e => {
              setPriceMin(e.target.value);
            }}
          />
          <span className="price-separator">-</span>
          <Input
            type="number"
            placeholder="Max"
            name="priceMax"
            id="priceMax"
            value={priceMax}
            onChange={e => {
              setPriceMax(e.target.value);
            }}
          />
          <Button className="apply-price" onClick={handlePriceChange}>
            Apply
          </Button>
        </div>
      </div>

      {Object.entries(categoryStructure).map(([parentCategory, items]) => (
        <div key={parentCategory} className="filter-section">
          <h4>{parentCategory}</h4>
          <div className="filter-options">
            {items.map(item => (
              <div
                key={item}
                className={`category-item ${selectedCategories.includes(item) ? 'selected' : ''}`}
                onClick={() => onCategorySelect(item)}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      ))}

      {isFilterActive() && (
        <div className="filter-actions">
          <Button className="reset-filters" onClick={resetFilters}>
            Reset
          </Button>
        </div>
      )}
    </div>
  );
};

export default FilterSidebar;
