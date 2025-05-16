import React, { useEffect, useState } from 'react';
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
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  onFilterChange,
  categoryStructure,
  initialFilters = {},
}) => {
  const [filters, setFilters] = useState<ProductFilters>(initialFilters);
  const [priceMin, setPriceMin] = useState<string>(
    initialFilters.priceRange?.min?.toString() || ''
  );
  const [priceMax, setPriceMax] = useState<string>(
    initialFilters.priceRange?.max?.toString() || ''
  );

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleCheckboxChange = (category: string, value: string, checked: boolean) => {
    setFilters(prevFilters => {
      const categoryKey = category.toLowerCase() as keyof ProductFilters;
      const currentValues = (prevFilters[categoryKey] as string[]) || [];
      const newValues = checked
        ? [...currentValues, value]
        : currentValues.filter(v => v !== value);

      return {
        ...prevFilters,
        [categoryKey]: newValues,
      };
    });
  };

  const handlePriceChange = () => {
    const min = priceMin ? parseFloat(priceMin) : undefined;
    const max = priceMax ? parseFloat(priceMax) : undefined;

    setFilters(prevFilters => ({
      ...prevFilters,
      priceRange: { min, max },
    }));
  };

  const resetFilters = () => {
    setFilters({});
    setPriceMin('');
    setPriceMax('');
  };

  const isFilterActive = () => {
    return (
      Object.keys(filters).some(
        key =>
          key !== 'priceRange' &&
          Array.isArray(filters[key as keyof ProductFilters]) &&
          (filters[key as keyof ProductFilters] as string[]).length > 0
      ) ||
      filters.priceRange?.min !== undefined ||
      filters.priceRange?.max !== undefined
    );
  };

  return (
    <div className="filter-sidebar">
      <div className="filter-header">
        <h3>Filters</h3>
      </div>
      <>
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

        {Object.entries(categoryStructure).map(([parentCategory, items]) => {
          const categoryKey = parentCategory.toLowerCase() as keyof ProductFilters;

          return (
            <div key={parentCategory} className="filter-section">
              <h4>{parentCategory}</h4>
              <div className="filter-options">
                {items.map(item => {
                  const isChecked = filters[categoryKey]
                    ? (filters[categoryKey] as string[])?.includes(item)
                    : false;

                  return (
                    <Input
                      key={item}
                      type="checkbox"
                      id={`${parentCategory.toLowerCase()}-${item}`}
                      name={`${parentCategory.toLowerCase()}-${item}`}
                      labelText={item}
                      checked={isChecked}
                      onChange={e => handleCheckboxChange(parentCategory, item, e.target.checked)}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}

        {isFilterActive() && (
          <div className="filter-actions">
            <Button className="reset-filters" onClick={resetFilters}>
              Reset filters
            </Button>
          </div>
        )}
      </>
    </div>
  );
};

export default FilterSidebar;
