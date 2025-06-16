import React, { useState, useEffect } from 'react';
import { ProductFilters } from '../../types/interfaces';
import Input from '../input/Input';
import { useAppContext } from '../../features/app/hooks/useAppContext';
import './FilterPanel.css';

interface FilterPanelProps {
  filters: ProductFilters;
  onFilterChange: (filters: ProductFilters) => void;
  onResetFilters: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFilterChange, onResetFilters }) => {
  const { availableFlavors, priceRange, isLoading } = useAppContext();
  const [minPrice, setMinPrice] = useState<number | undefined>(
    filters.priceRange?.min ?? priceRange.min
  );
  const [maxPrice, setMaxPrice] = useState<number | undefined>(
    filters.priceRange?.max ?? priceRange.max
  );

  useEffect(() => {
    if (filters.priceRange?.min !== minPrice || filters.priceRange?.max !== maxPrice) {
      setMinPrice(filters.priceRange?.min ?? priceRange.min);
      setMaxPrice(filters.priceRange?.max ?? priceRange.max);
    }
  }, [filters.priceRange, priceRange.min, priceRange.max]);

  const handleFlavorChange = (flavor: string) => {
    onFilterChange({
      ...filters,
      flavors: [flavor],
    });
  };

  const handleBestSellerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      isBestSeller: event.target.checked,
    });
  };

  const handleGlutenFreeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      isGlutenFree: event.target.checked,
    });
  };

  const handleMinPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value === '' ? undefined : parseInt(event.target.value);
    if (value !== undefined && value < 0) return;
    setMinPrice(value);

    onFilterChange({
      ...filters,
      priceRange: {
        min: value,
        max: maxPrice,
      },
    });
  };

  const handleMaxPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value === '' ? undefined : parseInt(event.target.value);
    if (value !== undefined && value < 0) return;
    setMaxPrice(value);

    onFilterChange({
      ...filters,
      priceRange: {
        min: minPrice,
        max: value,
      },
    });
  };

  const handleResetFilters = () => {
    setMinPrice(priceRange.min);
    setMaxPrice(priceRange.max);
    onResetFilters();
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  if (isLoading) {
    return <div className="filter-panel-loading">Loading filters...</div>;
  }

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h3>Filters</h3>
        <button className="reset-button" onClick={handleResetFilters}>
          Reset All
        </button>
      </div>

      <div className="filter-section">
        <h4>Price Range</h4>
        <div className="price-range-inputs">
          <div className="price-input">
            <Input
              labelText="from"
              id="min-price"
              name="minPrice"
              type="number"
              min="0"
              value={minPrice?.toString() || ''}
              onChange={handleMinPriceChange}
            />
          </div>
          <div className="price-input">
            <Input
              labelText="to"
              id="max-price"
              name="maxPrice"
              type="number"
              min="0"
              value={maxPrice?.toString() || ''}
              onChange={handleMaxPriceChange}
            />
          </div>
        </div>
      </div>

      <div className="filter-section">
        <h4>Flavors</h4>
        <div className="product-type-options">
          {availableFlavors.length > 0 ? (
            <>
              <div className="flavor-option">
                <Input
                  type="checkbox"
                  id="flavor-all"
                  name="flavor-all"
                  checked={!filters.flavors || filters.flavors.length === 0}
                  onChange={() => onFilterChange({ ...filters, flavors: [] })}
                  labelText="All Flavors"
                />
              </div>
              {availableFlavors.map(flavor => (
                <div className="flavor-option" key={flavor}>
                  <Input
                    type="checkbox"
                    id={`flavor-${flavor}`}
                    name={`flavor-${flavor}`}
                    checked={(filters.flavors || []).includes(flavor)}
                    onChange={() => handleFlavorChange(flavor)}
                    labelText={capitalizeFirstLetter(flavor)}
                  />
                </div>
              ))}
            </>
          ) : (
            <p>No flavors available</p>
          )}
        </div>
      </div>

      <div className="filter-section">
        <h4>Product Type</h4>
        <div className="product-type-options">
          <div className="best-seller-option">
            <Input
              type="checkbox"
              id="best-seller"
              name="best-seller"
              checked={filters.isBestSeller || false}
              onChange={handleBestSellerChange}
              labelText="Best Seller"
            />
          </div>
          <div className="best-seller-option">
            <Input
              type="checkbox"
              id="gluten-free"
              name="gluten-free"
              checked={filters.isGlutenFree || false}
              onChange={handleGlutenFreeChange}
              labelText="Gluten Free"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
