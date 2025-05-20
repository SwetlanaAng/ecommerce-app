import React, { useEffect, useState } from 'react';
import { ProductFilters } from '../../types/interfaces';
import { getProductFlavors, getPriceRange } from '../../services/products.service';
import Button from '../button/Button';
import Input from '../input/Input';
import './FilterPanel.css';

interface FilterPanelProps {
  filters: ProductFilters;
  onFilterChange: (filters: ProductFilters) => void;
  onResetFilters: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFilterChange, onResetFilters }) => {
  const [availableFlavors, setAvailableFlavors] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number | undefined>(filters.priceRange?.min);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(filters.priceRange?.max);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilterData = async () => {
      setLoading(true);
      try {
        const [flavors, prices] = await Promise.all([getProductFlavors(), getPriceRange()]);

        setAvailableFlavors(flavors);

        if (minPrice === undefined) {
          setMinPrice(prices.min);
        }
        if (maxPrice === undefined) {
          setMaxPrice(prices.max);
        }
      } catch (error) {
        console.error('Error fetching filter data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilterData();
  }, []);

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

  const handlePriceChange = () => {
    onFilterChange({
      ...filters,
      priceRange: {
        min: minPrice,
        max: maxPrice,
      },
    });
  };

  const handleMinPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value ? parseInt(event.target.value) : undefined;
    setMinPrice(value);
  };

  const handleMaxPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value ? parseInt(event.target.value) : undefined;
    setMaxPrice(value);
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  if (loading) {
    return <div className="filter-panel-loading">Loading filters...</div>;
  }

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h3>Filters</h3>
        <button className="reset-button" onClick={onResetFilters}>
          Reset All
        </button>
      </div>

      <div className="filter-section">
        <h4>Price Range</h4>
        <div className="price-range-inputs">
          <div className="price-input">
            <Input
              id="min-price"
              name="minPrice"
              labelText="Min:"
              type="number"
              value={minPrice?.toString() || ''}
              onChange={handleMinPriceChange}
            />
          </div>
          <div className="price-input">
            <Input
              id="max-price"
              name="maxPrice"
              labelText="Max:"
              type="number"
              value={maxPrice?.toString() || ''}
              onChange={handleMaxPriceChange}
            />
          </div>
          <Button className="apply-price-button" onClick={handlePriceChange}>
            Apply
          </Button>
        </div>
      </div>

      <div className="filter-section">
        <h4>Flavors</h4>
        <div className="flavor-options">
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
      </div>
    </div>
  );
};

export default FilterPanel;
