import { render, screen, fireEvent } from '@testing-library/react';
import ProductDetailCard from './ProductDetailCard';
import { Product } from '../../types/interfaces';

jest.mock(
  '../image/ImageModal',
  () => (props: { isOpen: boolean }) => (props.isOpen ? <div role="dialog">Modal Open</div> : null)
);

jest.mock('../../features/cart/hooks/useCart', () => ({
  useCart: () => ({
    cart: { lineItems: [] },
    addToCart: jest.fn(),
    removeFromCart: jest.fn(),
  }),
}));

const mockProduct: Product = {
  id: 'product-1',
  version: 1,
  productType: {
    typeId: 'product-type',
    id: 'pt-1',
  },
  name: {
    'en-US': 'Test Product',
  },
  description: {
    'en-US': 'This is a test product',
  },
  categories: [
    {
      id: 'cat-1',
      typeId: 'category',
    },
  ],
  masterVariant: {
    id: 1,
    prices: [
      {
        id: 'price-1',
        value: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 2000,
          fractionDigits: 2,
        },
        discounted: {
          value: {
            type: 'centPrecision',
            currencyCode: 'USD',
            centAmount: 1500,
            fractionDigits: 2,
          },
        },
      },
    ],
    images: [
      {
        url: 'https://example.com/image1.jpg',
        dimensions: {
          w: 500,
          h: 500,
        },
      },
      {
        url: 'https://example.com/image2.jpg',
        dimensions: {
          w: 400,
          h: 400,
        },
      },
    ],
    attributes: [
      {
        name: 'color',
        value: 'red',
      },
    ],
  },
  searchKeywords: {
    en: [
      {
        text: 'test',
      },
    ],
  },
  slug: {
    'en-US': 'test-product',
  },
  metaTitle: {
    en: 'Meta Title',
  },
  metaDescription: {
    en: 'Meta Description',
  },
  hasStagedChanges: false,
  published: true,
  key: 'product-key-1',
  taxCategory: {
    typeId: 'tax-category',
    id: 'tax-1',
  },
  priceMode: 'Platform',
  createdAt: new Date().toISOString(),
  lastModifiedAt: new Date().toISOString(),
};

describe('ProductDetailCard', () => {
  it('renders product info correctly', () => {
    render(<ProductDetailCard product={mockProduct} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();

    expect(screen.getByText('This is a test product')).toBeInTheDocument();

    expect(screen.getByText('20.00 USD')).toBeInTheDocument();
    expect(screen.getByText('15.00 USD')).toBeInTheDocument();

    const image = screen.getByAltText('Test Product image 1') as HTMLImageElement;
    expect(image).toBeInTheDocument();
    expect(image.src).toBe('https://example.com/image1.jpg');
  });

  it('changes image on next and prev buttons', () => {
    render(<ProductDetailCard product={mockProduct} />);

    const nextBtn = screen.getByRole('button', { name: '⟩' });
    const prevBtn = screen.getByRole('button', { name: '⟨' });

    expect((screen.getByAltText('Test Product image 1') as HTMLImageElement).src).toBe(
      'https://example.com/image1.jpg'
    );

    fireEvent.click(nextBtn);
    expect((screen.getByAltText('Test Product image 2') as HTMLImageElement).src).toBe(
      'https://example.com/image2.jpg'
    );

    fireEvent.click(prevBtn);
    expect((screen.getByAltText('Test Product image 1') as HTMLImageElement).src).toBe(
      'https://example.com/image1.jpg'
    );
  });

  it('opens and closes modal when image clicked', () => {
    render(<ProductDetailCard product={mockProduct} />);

    const image = screen.getByAltText('Test Product image 1');
    fireEvent.click(image);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
