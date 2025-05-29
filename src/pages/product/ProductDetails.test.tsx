import { render, screen, waitFor } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import ProductDetails from './ProductDetails';
import { getProductBySlug } from '../../services/product.service';

interface MockProductDetailCardProps {
  product?: {
    name?: {
      'en-US'?: string;
    };
  };
}

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    __esModule: true,
    ...originalModule,
    useParams: jest.fn(),
    useNavigate: jest.fn(),
  };
});

jest.mock('../../services/product.service', () => ({
  getProductBySlug: jest.fn(),
}));

jest.mock(
  '../../components/product/ProductDetailCard',
  () => (props: MockProductDetailCardProps) => (
    <div>ProductDetailCard - {props.product?.name?.['en-US'] || 'No product name'}</div>
  )
);

jest.mock('../../components/loader/Loader', () => () => <div>Loading...</div>);

describe('ProductDetails Component', () => {
  const mockedUseParams = useParams as jest.Mock;
  const mockedGetProductBySlug = getProductBySlug as jest.Mock;

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders loader while loading', async () => {
    mockedUseParams.mockReturnValue({ slug: 'test-product' });

    type MockProduct = {
      id: string;
      name: { 'en-US': string };
    };

    let resolvePromise!: (value: MockProduct) => void;
    const promise = new Promise<MockProduct>(res => {
      resolvePromise = res;
    });

    mockedGetProductBySlug.mockReturnValue(promise);

    render(<ProductDetails />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    resolvePromise({ id: '123', name: { 'en-US': 'Test Product' } });

    await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());
  });

  test('renders product details after loading', async () => {
    mockedUseParams.mockReturnValue({ slug: 'test-product' });
    mockedGetProductBySlug.mockResolvedValue({ id: '123', name: { 'en-US': 'Test Product' } });

    render(<ProductDetails />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/ProductDetailCard - Test Product/i)).toBeInTheDocument();
    });
  });

  test('renders error message on fetch failure', async () => {
    mockedUseParams.mockReturnValue({ slug: 'test-product' });
    mockedGetProductBySlug.mockRejectedValue(new Error('Failed to fetch'));

    render(<ProductDetails />);

    await waitFor(() => {
      expect(screen.getByText(/error loading product/i)).toBeInTheDocument();
      expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument();
    });
  });

  test('renders "Product not found." when no product returned', async () => {
    mockedUseParams.mockReturnValue({ slug: 'test-product' });
    mockedGetProductBySlug.mockResolvedValue(null);

    render(<ProductDetails />);

    await waitFor(() => {
      expect(screen.getByText(/product not found/i)).toBeInTheDocument();
    });
  });

  test('does not fetch product if slug param is missing', () => {
    mockedUseParams.mockReturnValue({ slug: undefined });
    render(<ProductDetails />);
    expect(mockedGetProductBySlug).not.toHaveBeenCalled();
  });
});
