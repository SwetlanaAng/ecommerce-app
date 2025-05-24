import React, { useState, useEffect, ReactNode } from 'react';
import { getCategoryHierarchy } from '../../../services/category.service';
import { getProductFlavors, getPriceRange } from '../../../services/products.service';
import { CategoryWithChildren } from '../../../types/interfaces';
import { AppContext, AppContextType } from './AppContextTypes';

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [categories, setCategories] = useState<CategoryWithChildren[]>([]);
  const [availableFlavors, setAvailableFlavors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppData = async () => {
      setIsLoading(true);
      try {
        const [categoriesData, flavors, prices] = await Promise.all([
          getCategoryHierarchy(),
          getProductFlavors(),
          getPriceRange(),
        ]);

        setCategories(categoriesData as CategoryWithChildren[]);
        setAvailableFlavors(flavors);
        setPriceRange(prices);
      } catch (err) {
        setError('Failed to load application data');
        console.error('Error loading app data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppData();
  }, []);

  const value: AppContextType = {
    categories,
    availableFlavors,
    priceRange,
    isLoading,
    error,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
