import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCategoryHierarchy } from '../../../services/category.service';
import { getProductFlavors, getPriceRange } from '../../../services/products.service';
import { CategoryWithChildren } from '../../../types/interfaces';

interface AppContextType {
  categories: CategoryWithChildren[];
  availableFlavors: string[];
  priceRange: {
    min: number;
    max: number;
  };
  isLoading: boolean;
  error: string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

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

  const value = {
    categories,
    availableFlavors,
    priceRange,
    isLoading,
    error,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
