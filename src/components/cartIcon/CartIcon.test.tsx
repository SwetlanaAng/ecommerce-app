import { render, screen } from '@testing-library/react';
import { CartIcon } from './CartIcon';

const renderCartIcon = () => {
  return render(<CartIcon title="cart" />);
};

describe('CartIcon component', () => {
  it('renders correctly for unauthenticated users', () => {
    renderCartIcon();

    expect(screen.getByTitle(/cart/i)).toBeInTheDocument();
  });
});
