import { render, screen } from '@testing-library/react';
import SkeletonCard from './SkeletonCard';

describe('SkeletonCard', () => {
  it('renders one skeleton card by default', () => {
    render(<SkeletonCard />);
    const cards = screen.getAllByTestId('skeleton-card');
    expect(cards).toHaveLength(1);
  });

  it('renders correct number of skeleton cards based on count prop', () => {
    const count = 5;
    render(<SkeletonCard count={count} />);
    const cards = screen.getAllByTestId('skeleton-card');
    expect(cards).toHaveLength(count);
  });

  it('each skeleton card contains required sub-elements', () => {
    render(<SkeletonCard count={1} />);
    const card = screen.getByTestId('skeleton-card');

    expect(card.querySelector('.skeleton-image')).toBeInTheDocument();
    expect(card.querySelector('.skeleton-content')).toBeInTheDocument();
    expect(card.querySelector('.skeleton-title')).toBeInTheDocument();
    expect(card.querySelector('.skeleton-price')).toBeInTheDocument();
    expect(card.querySelectorAll('.skeleton-line')).toHaveLength(2);
  });
});
