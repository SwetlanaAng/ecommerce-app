import React, { useEffect, useState } from 'react';
import ProductCard from '../../components/product/ProductCard';
import { Product, ProductCardProps, ProductFilters } from '../../types/interfaces';
import { getProductsList, SortOption, searchProducts } from '../../services/products.service';
import { getCategoriesNamesWithParent } from '../../services/category.service';
import toCardAdapter from '../../lib/utils/productDataAdapters/toCardAdapter';
import SkeletonCard from '../../components/skeleton/SkeletonCard';
import Select from '../../components/select/Select';
import sadMacaron from '../../assets/sadMacaron.png';
import Input from '../../components/input/Input';
import FilterSidebar from '../../components/filters/FilterSidebar';
import Button from '../../components/button/Button';
import './Catalog.css';

interface CategoryStructure {
  name: string;
  parentName: string | null;
}

interface GroupedCategories {
  [key: string]: string[];
}

const Catalog: React.FC = () => {
  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('');
  const [filters, setFilters] = useState<ProductFilters>({});
  const [categoryStructure, setCategoryStructure] = useState<GroupedCategories>({});

  const sortOptions = {
    '': 'Default',
    'name.en-US asc': 'Name (A-Z)',
    'name.en-US desc': 'Name (Z-A)',
    'price asc': 'Price (Low to High)',
    'price desc': 'Price (High to Low)',
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getCategoriesNamesWithParent();

        const grouped: GroupedCategories = {};
        categories.forEach((category: CategoryStructure) => {
          if (!category.parentName) return;

          if (!grouped[category.parentName]) {
            grouped[category.parentName] = [];
          }

          grouped[category.parentName].push(category.name);
        });

        setCategoryStructure(grouped);
      } catch (error) {
        setError('Error fetching categories, please try again later');
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async (sort: SortOption, productFilters: ProductFilters) => {
      setLoading(true);
      try {
        let productsList: Product[] | undefined;

        if (searchQuery) {
          productsList = await searchProducts(searchQuery);
        } else {
          productsList = await getProductsList(200, '', sort, productFilters);
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

    fetchProducts(sortOption, filters);
  }, [sortOption, searchQuery, filters]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value as SortOption);
  };

  const handleFilterChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
  };

  if (error) {
    return (
      <div className="catalog-page">
        <h1>Product Catalog</h1>
        <h4>{error}</h4>
        <Button onClick={() => window.location.reload()}>Try again</Button>
      </div>
    );
  }

  return (
    <div className="catalog-page">
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
        <Select
          name="sort-select"
          value={sortOption}
          onChange={handleSortChange}
          optionsList={sortOptions}
        />
      </div>

      <div className="catalog-layout">
        <FilterSidebar
          onFilterChange={handleFilterChange}
          categoryStructure={categoryStructure}
          initialFilters={filters}
        />

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
  );
};

export default Catalog;
