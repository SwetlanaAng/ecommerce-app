import { render, screen, waitFor } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import ProductDetails from './ProductDetails';
import { getProductById } from '../../services/product.service';

interface MockProductDetailCardProps {
  product?: {
    name?: {
      'en-US'?: string;
    };
  };
}

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}));

jest.mock('../../services/product.service', () => ({
  getProductById: jest.fn(),
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
  const mockedGetProductById = getProductById as jest.Mock;

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders loader while loading', async () => {
    mockedUseParams.mockReturnValue({ id: '123' });

    type MockProduct = {
      id: string;
      name: { 'en-US': string };
    };

    let resolvePromise!: (value: MockProduct) => void;
    const promise = new Promise<MockProduct>(res => {
      resolvePromise = res;
    });

    mockedGetProductById.mockReturnValue(promise);

    render(<ProductDetails />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    resolvePromise({ id: '123', name: { 'en-US': 'Test Product' } });

    await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());
  });

  test('renders product details after loading', async () => {
    mockedUseParams.mockReturnValue({ id: '123' });
    mockedGetProductById.mockResolvedValue({ id: '123', name: { 'en-US': 'Test Product' } });

    render(<ProductDetails />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/ProductDetailCard - Test Product/i)).toBeInTheDocument();
    });
  });

  test('renders error message on fetch failure', async () => {
    mockedUseParams.mockReturnValue({ id: '123' });
    mockedGetProductById.mockRejectedValue(new Error('Failed to fetch'));

    render(<ProductDetails />);

    await waitFor(() => {
      expect(screen.getByText(/error loading products/i)).toBeInTheDocument();
      expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument();
    });
  });

  test('renders "Product not found." when no product returned', async () => {
    mockedUseParams.mockReturnValue({ id: '123' });
    mockedGetProductById.mockResolvedValue(null);

    render(<ProductDetails />);

    await waitFor(() => {
      expect(screen.getByText(/product not found/i)).toBeInTheDocument();
    });
  });

  test('does not fetch product if id param is missing', () => {
    mockedUseParams.mockReturnValue({ id: undefined });
    render(<ProductDetails />);
    expect(mockedGetProductById).not.toHaveBeenCalled();
  });
});
