import { render, screen } from '@testing-library/react';
import { CartIcon } from './CartIcon';

const renderCartIcon = () => {
  return render(<CartIcon title="cart" />);
};

describe('CartIcon component', () => {
  /* beforeEach(() => {
        jest.clearAllMocks();
    }); */

  it('renders correctly for unauthenticated users', () => {
    /* mockedUseAuth.mockReturnValue({ isAuthenticated: false }); */

    renderCartIcon();

    expect(screen.getByTitle(/cart/i)).toBeInTheDocument();
  });
});
