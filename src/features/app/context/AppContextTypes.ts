import { createContext } from 'react';
import { CategoryWithChildren } from '../../../types/interfaces';

export interface AppContextType {
  categories: CategoryWithChildren[];
  availableFlavors: string[];
  priceRange: {
    min: number;
    max: number;
  };
  isLoading: boolean;
  error: string | null;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
