import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../../components/product/ProductCard';
import { ProductCardProps, ProductFilters } from '../../types/interfaces';
import { getProductsList, SortOption, searchProducts } from '../../services/products-local.service';
import toCardAdapter from '../../lib/utils/productDataAdapters/toCardAdapter';
import SkeletonCard from '../../components/skeleton/SkeletonCard';
import Select from '../../components/select/Select';
import sadMacaron from '../../assets/sadMacaron.png';
import Input from '../../components/input/Input';
import Button from '../../components/button/Button';
import FilterPanel from '../../components/filters/FilterPanel';
import ActiveFilters from '../../components/filters/ActiveFilters';
import CategoryNav from '../../components/category-nav/CategoryNav';
import Breadcrumbs from '../../components/breadcrumbs/Breadcrumbs';
import {
  getCategoryById,
  getCategoryPath,
  CategoryPath,
} from '../../services/category-local.service';
import './Catalog.css';

const Catalog: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined);
  const [categoryPath, setCategoryPath] = useState<CategoryPath[]>([]);
  const [currentCategoryName, setCurrentCategoryName] = useState<string | undefined>(undefined);
  const [fullSearchResults, setFullSearchResults] = useState<ProductCardProps[] | null>(null);
  const [filters, setFilters] = useState<ProductFilters>({
    flavors: [],
    priceRange: {
      min: undefined,
      max: undefined,
    },
    isBestSeller: undefined,
    isGlutenFree: undefined,
    categoryId: undefined,
  });

  const sortOptions = {
    '': 'Recommended',
    'name.en-US asc': 'Name (A-Z)',
    'name.en-US desc': 'Name (Z-A)',
    'price asc': 'Price (Low to High)',
    'price desc': 'Price (High to Low)',
  };

  const BATCH_SIZE = 9;

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const categoryParam = queryParams.get('category');

    if (categoryParam) {
      setSelectedCategoryId(categoryParam);
      setFilters(prev => ({
        ...prev,
        categoryId: categoryParam,
      }));
      fetchCategoryPath(categoryParam);
    } else {
      setSelectedCategoryId(undefined);
      setCategoryPath([]);
      setCurrentCategoryName(undefined);
      setFilters(prev => ({
        ...prev,
        categoryId: undefined,
      }));
    }
  }, [location.search]);

  const fetchCategoryPath = async (categoryId: string) => {
    try {
      const category = await getCategoryById(categoryId);
      if (category) {
        setCurrentCategoryName(category.name['en-US']);
      }

      const path = await getCategoryPath(categoryId);
      setCategoryPath(path.slice(0, -1));
    } catch (error) {
      console.error('Error fetching category path:', error);
    }
  };

  const resetAndFetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    setOffset(0);
    setHasMore(true);

    try {
      if (searchQuery) {
        const all = await searchProducts(searchQuery, filters, sortOption);
        const adapted = await Promise.all(all.map(toCardAdapter));
        setFullSearchResults(adapted);
        setProducts(adapted.slice(0, BATCH_SIZE));
        setHasMore(adapted.length > BATCH_SIZE);
        setOffset(BATCH_SIZE);
      } else {
        const list = await getProductsList(BATCH_SIZE + 1, '0', sortOption, filters);
        const batch = await Promise.all(list.slice(0, BATCH_SIZE).map(toCardAdapter));
        setProducts(batch);
        setHasMore(list.length > BATCH_SIZE);
        setOffset(BATCH_SIZE);
      }
    } catch {
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, sortOption, filters]);

  useEffect(() => {
    resetAndFetch();
  }, [resetAndFetch]);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      let batch: ProductCardProps[] = [];
      const nextOffset = offset + BATCH_SIZE;

      if (searchQuery && fullSearchResults) {
        batch = fullSearchResults.slice(offset, nextOffset);
        setProducts(prev => [...prev, ...batch]);
        setHasMore(nextOffset < fullSearchResults.length);
      } else {
        const list = await getProductsList(BATCH_SIZE + 1, offset.toString(), sortOption, filters);
        const adapted = await Promise.all(list.map(toCardAdapter));
        const visibleBatch = adapted.slice(0, BATCH_SIZE);
        setProducts(prev => [...prev, ...visibleBatch]);
        setHasMore(adapted.length > BATCH_SIZE);
      }

      setOffset(nextOffset);
    } catch {
      setError('Failed to load more products.');
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      handleSearchWithTransition(query);
    }, 500);
  };

  const handleSearchWithTransition = useCallback(
    async (query: string) => {
      setError(null);
      setOffset(0);
      setHasMore(true);

      if (query) {
        const all = await searchProducts(query, filters, sortOption);
        const adapted = await Promise.all(all.map(toCardAdapter));
        setFullSearchResults(adapted);
        setProducts(adapted.slice(0, BATCH_SIZE));
        setHasMore(adapted.length > BATCH_SIZE);
        setOffset(BATCH_SIZE);
      } else {
        const list = await getProductsList(BATCH_SIZE + 1, '0', sortOption, filters);
        const batch = await Promise.all(list.slice(0, BATCH_SIZE).map(toCardAdapter));
        setProducts(batch);
        setHasMore(list.length > BATCH_SIZE);
        setOffset(BATCH_SIZE);
      }
    },
    [filters, sortOption]
  );

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortOption = e.target.value as SortOption;
    setSortOption(newSortOption);
  };

  const handleCategorySelect = (categoryId: string) => {
    navigate(`/catalog?category=${categoryId}`);
  };

  const handleFilterChange = (newFilters: ProductFilters) => {
    const updatedFilters = {
      ...newFilters,
      categoryId: filters.categoryId,
    };
    setFilters(updatedFilters);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      flavors: [],
      priceRange: {
        min: undefined,
        max: undefined,
      },
      isBestSeller: undefined,
      isGlutenFree: undefined,
      categoryId: filters.categoryId,
    };
    setFilters(resetFilters);
  };

  const handleRemoveFilter = (filterType: string, value?: string) => {
    let updatedFilters = { ...filters };

    switch (filterType) {
      case 'minPrice':
        updatedFilters = {
          ...filters,
          priceRange: {
            ...filters.priceRange,
            min: undefined,
          },
        };
        break;
      case 'maxPrice':
        updatedFilters = {
          ...filters,
          priceRange: {
            ...filters.priceRange,
            max: undefined,
          },
        };
        break;
      case 'flavor':
        if (value) {
          const newFlavors = (filters.flavors || []).filter((f: string) => f !== value);
          updatedFilters = {
            ...filters,
            flavors: newFlavors,
          };
        } else {
          updatedFilters = {
            ...filters,
            flavors: [],
          };
        }
        break;
      case 'isBestSeller':
        updatedFilters = {
          ...filters,
          isBestSeller: undefined,
        };
        break;
      case 'isGlutenFree':
        updatedFilters = {
          ...filters,
          isGlutenFree: undefined,
        };
        break;
      case 'category':
        navigate('/catalog');
        return;
      case 'all':
        handleResetFilters();
        navigate('/catalog');
        return;
      default:
        return;
    }

    setFilters(updatedFilters);
  };

  if (error) {
    return (
      <div className="catalog-page">
        <h1>Product Catalog</h1>
        <h4 style={{ marginBottom: '20px' }}>{error}</h4>
        <Button onClick={() => window.location.reload()}>Try again</Button>
      </div>
    );
  }

  return (
    <div className="catalog-page">
      <Breadcrumbs categoryPath={categoryPath} currentCategory={currentCategoryName} />

      <h1>Product Catalog</h1>
      <div className="catalog-controls">
        <div className="search-container">
          <Input
            placeholder="Search products"
            name="search"
            id="search"
            onChange={handleSearch}
            value={searchQuery}
            autoComplete="off"
            isSearchField={true}
          />
        </div>
        <div className="filter-sort-controls">
          <Select
            name="sort-select"
            value={sortOption}
            onChange={handleSortChange}
            optionsList={sortOptions}
          />
        </div>
      </div>

      <ActiveFilters
        filters={{
          ...filters,
          categoryName: currentCategoryName,
        }}
        onRemoveFilter={handleRemoveFilter}
      />

      <div className="catalog-layout">
        <div className="catalog-sidebar">
          <CategoryNav
            onSelectCategory={handleCategorySelect}
            selectedCategoryId={selectedCategoryId}
          />

          <FilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
          />
        </div>

        <div className="catalog-products">
          {loading ? (
            <div className="catalog-flex">
              {[...Array(9)].map((_, index) => (
                <SkeletonCard key={index} count={1} />
              ))}
            </div>
          ) : (
            <div className="catalog-flex">
              {products.length === 0 ? (
                <div className="no-products-found">
                  <img src={sadMacaron} alt="sad macaron" />
                  <p>No products found</p>
                </div>
              ) : (
                products.map((product, index) => (
                  <div
                    className="catalog-card-animated"
                    style={{ animationDelay: `${index * 0.05}s` }}
                    key={product.id || index}
                  >
                    <ProductCard {...product} />
                  </div>
                ))
              )}
            </div>
          )}
          {hasMore && !loading && (
            <div className="catalog-load-more">
              <Button onClick={loadMore} disabled={loadingMore}>
                {loadingMore ? 'Loading…' : 'Load More'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Catalog;
