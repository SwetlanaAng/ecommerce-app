import React, { useEffect, useState } from 'react';
import ProductCard from '../../components/product/ProductCard';
import { Product, ProductCardProps } from '../../types/interfaces';
import { getProductsList, SortOption } from '../../services/products.service';
import toCardAdapter from '../../lib/utils/productDataAdapters/toCardAdapter';
import SkeletonCard from '../../components/skeleton/SkeletonCard';
import Select from '../../components/select/Select';
import sadMacaron from '../../assets/sadMacaron.png';
import Input from '../../components/input/Input';
import './Catalog.css';

const Catalog: React.FC = () => {
  const [allProducts, setAllProducts] = useState<ProductCardProps[]>([]);
  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('');

  const sortOptions = {
    '': 'Default',
    'name.en-US asc': 'Name (A-Z)',
    'name.en-US desc': 'Name (Z-A)',
    'price asc': 'Price (Low to High)',
    'price desc': 'Price (High to Low)',
  };

  useEffect(() => {
    const fetchProducts = async (sort: SortOption) => {
      setLoading(true);
      try {
        const productsList: Product[] | undefined = await getProductsList(200, undefined, sort);
        if (productsList) {
          const adaptedProducts = await Promise.all(
            productsList.map(product => toCardAdapter(product))
          );
          setAllProducts(adaptedProducts);

          if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            setProducts(
              adaptedProducts.filter(
                product =>
                  product.name.toLowerCase().includes(lowerQuery) ||
                  (product.description && product.description.toLowerCase().includes(lowerQuery))
              )
            );
          } else {
            setProducts(adaptedProducts);
          }
        } else {
          setError('Failed to load products');
        }
      } catch (err) {
        setError('Error loading products.' + err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts(sortOption);
  }, [sortOption, searchQuery]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    if (!query) {
      setProducts(allProducts);
      return;
    }
    const lowerQuery = query.toLowerCase();
    setProducts(
      allProducts.filter(
        product =>
          product.name.toLowerCase().includes(lowerQuery) ||
          (product.description && product.description.toLowerCase().includes(lowerQuery))
      )
    );
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value as SortOption);
  };

  if (error) {
    return (
      <div className="catalog-page">
        <h1>Product Catalog</h1>
        <p>Error loading products, please try again later.</p>
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
            required={false}
            disabled={false}
            autoComplete="off"
          />
        </div>
        <Select
          name="sort-select"
          value={sortOption}
          onChange={handleSortChange}
          required={false}
          disabled={false}
          optionsList={sortOptions}
        />
      </div>
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
  );
};

export default Catalog;
