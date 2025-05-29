import { render, screen, fireEvent } from '@testing-library/react';
import * as reactRouterDom from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AppRouterPaths } from '../../routes/AppRouterPathsEnums';
import NotFound from './NotFound';

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as typeof reactRouterDom),
  useNavigate: jest.fn(),
}));

describe('NotFound Component', () => {
  const mockedNavigate = jest.fn();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockedNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders NotFound page with heading, image, and button', () => {
    render(<NotFound />);

    expect(screen.getByRole('heading', { name: /sorry, page not found/i })).toBeInTheDocument();
    expect(screen.getByAltText('notFound')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back to the home page/i })).toBeInTheDocument();
  });

  test('navigates to main page when button is clicked', () => {
    render(<NotFound />);

    const button = screen.getByRole('button', { name: /back to the home page/i });
    fireEvent.click(button);

    expect(mockedNavigate).toHaveBeenCalledWith(AppRouterPaths.MAIN);
  });
});
