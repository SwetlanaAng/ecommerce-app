import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../../components/product/ProductCard';
import { Product, ProductCardProps, ProductFilters } from '../../types/interfaces';
import { getProductsList, SortOption, searchProducts } from '../../services/products.service';
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
import { getCategoryById, getCategoryPath, CategoryPath } from '../../services/category.service';
import './Catalog.css';

const Catalog: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined);
  const [categoryPath, setCategoryPath] = useState<CategoryPath[]>([]);
  const [currentCategoryName, setCurrentCategoryName] = useState<string | undefined>(undefined);
  const [filters, setFilters] = useState<ProductFilters>({
    flavors: [],
    priceRange: {
      min: undefined,
      max: undefined,
    },
    isBestSeller: undefined,
    categoryId: undefined,
  });

  const sortOptions = {
    '': 'Default',
    'name.en-US asc': 'Name (A-Z)',
    'name.en-US desc': 'Name (Z-A)',
    'price asc': 'Price (Low to High)',
    'price desc': 'Price (High to Low)',
  };

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

  useEffect(() => {
    const fetchProducts = async (sort: SortOption) => {
      setLoading(true);
      try {
        let productsList: Product[] | undefined;

        if (searchQuery) {
          productsList = await searchProducts(searchQuery, filters, sort);
        } else {
          productsList = await getProductsList(200, '', sort, filters);
        }

        if (productsList) {
          const adaptedProducts = await Promise.all(
            productsList.map(product => toCardAdapter(product))
          );
          setProducts(adaptedProducts);
        } else {
          setError('Failed to load products, please try again later');
        }
      } catch (err) {
        setError('Error loading products, please try again later');
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts(sortOption);
  }, [sortOption, searchQuery, filters]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value as SortOption);
  };

  const handleCategorySelect = (categoryId: string) => {
    navigate(`/catalog?category=${categoryId}`);
  };

  const handleFilterChange = (newFilters: ProductFilters) => {
    setFilters({
      ...newFilters,
      categoryId: filters.categoryId,
    });
  };

  const handleResetFilters = () => {
    setFilters({
      flavors: [],
      priceRange: {
        min: undefined,
        max: undefined,
      },
      isBestSeller: undefined,
      categoryId: filters.categoryId,
    });
  };

  const handleRemoveFilter = (filterType: string) => {
    switch (filterType) {
      case 'minPrice':
        setFilters({
          ...filters,
          priceRange: {
            ...filters.priceRange,
            min: undefined,
          },
        });
        break;
      case 'maxPrice':
        setFilters({
          ...filters,
          priceRange: {
            ...filters.priceRange,
            max: undefined,
          },
        });
        break;
      case 'flavor':
        setFilters({
          ...filters,
          flavors: [],
        });
        break;
      case 'isBestSeller':
        setFilters({
          ...filters,
          isBestSeller: undefined,
        });
        break;
      case 'category':
        navigate('/catalog');
        break;
      case 'all':
        handleResetFilters();
        navigate('/catalog');
        break;
      default:
        break;
    }
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
              {[...Array(8)].map((_, index) => (
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
                products.map((product, index) => <ProductCard {...product} key={index} />)
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Catalog;
