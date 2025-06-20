import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Catalog from './Catalog';

jest.mock('../../components/product/ProductCard', () => () => <div>Mocked ProductCard</div>);

jest.mock('../../components/skeleton/SkeletonCard', () => () => <div>Mocked SkeletonCard</div>);

jest.mock(
  '../../components/select/Select',
  () => (props: React.ComponentProps<'select'> & { optionsList: Record<string, string> }) => (
    <select onChange={props.onChange} value={props.value} data-testid="sort-select">
      {Object.entries(props.optionsList).map(([value, label]) => (
        <option key={value} value={value}>
          {String(label)}
        </option>
      ))}
    </select>
  )
);

jest.mock(
  '../../components/button/Button',
  () => (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button onClick={props.onClick}>{props.children}</button>
  )
);

jest.mock('../../components/filters/FilterPanel', () => () => <div>Mocked FilterPanel</div>);
jest.mock('../../components/filters/ActiveFilters', () => () => <div>Mocked ActiveFilters</div>);
jest.mock('../../components/category-nav/CategoryNav', () => () => <div>Mocked CategoryNav</div>);
jest.mock('../../components/breadcrumbs/Breadcrumbs', () => () => <div>Mocked Breadcrumbs</div>);

jest.mock('../../services/products.service', () => ({
  getProductsList: jest.fn(),
  searchProducts: jest.fn(),
}));
jest.mock('../../services/category.service', () => ({
  getCategoryById: jest.fn(),
  getCategoryPath: jest.fn(),
}));

jest.mock('../../lib/utils/productDataAdapters/toCardAdapter', () =>
  jest.fn(() => ({
    title: 'Mocked Product',
    price: 10,
    image: 'mock.png',
    id: '123',
  }))
);

import { getProductsList, searchProducts } from '../../services/products-local.service';
import { getCategoryById, getCategoryPath } from '../../services/category-local.service';

const mockedProducts = [
  { id: '1', name: { 'en-US': 'Vanilla Macaron' } },
  { id: '2', name: { 'en-US': 'Chocolate Macaron' } },
];

describe('Catalog Component', () => {
  beforeEach(() => {
    (getProductsList as jest.Mock).mockResolvedValue(mockedProducts);
    (searchProducts as jest.Mock).mockResolvedValue(mockedProducts);
    (getCategoryById as jest.Mock).mockResolvedValue({ name: { 'en-US': 'Test Category' } });
    (getCategoryPath as jest.Mock).mockResolvedValue([
      { name: { 'en-US': 'Path' } },
      { name: { 'en-US': 'Test Category' } },
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderCatalog = () =>
    render(
      <BrowserRouter>
        <Catalog />
      </BrowserRouter>
    );

  test('renders loading skeletons initially', async () => {
    renderCatalog();
    expect(screen.getAllByText('Mocked SkeletonCard').length).toBeGreaterThan(0);
    await waitFor(() => expect(getProductsList).toHaveBeenCalled());
  });

  test('displays products after loading', async () => {
    renderCatalog();
    await waitFor(() => {
      expect(screen.getAllByText('Mocked ProductCard').length).toBeGreaterThan(0);
    });
  });

  test('changes sort option', async () => {
    renderCatalog();
    const select = screen.getByTestId('sort-select');
    fireEvent.change(select, { target: { value: 'price asc' } });
    await waitFor(() => {
      expect(getProductsList).toHaveBeenCalledWith(10, '0', 'price asc', expect.anything());
    });
  });
});
