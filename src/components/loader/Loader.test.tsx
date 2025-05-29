import { render } from '@testing-library/react';
import Loader from './Loader';

describe('Loader', () => {
  it('renders without crashing', () => {
    const { getByRole } = render(<Loader />);
    const loader = getByRole('status');
    expect(loader).toBeInTheDocument();
  });

  it('applies default size class', () => {
    const { container } = render(<Loader />);
    const loaderElement = container.querySelector('.loader');
    expect(loaderElement).toHaveClass('medium');
  });

  it('applies correct size class when size is passed', () => {
    const { container } = render(<Loader size="large" />);
    const loaderElement = container.querySelector('.loader');
    expect(loaderElement).toHaveClass('large');
  });

  it('applies custom color style', () => {
    const testColor = '#123456';
    const { container } = render(<Loader color={testColor} />);
    const loaderElement = container.querySelector('.loader');
    expect(loaderElement).toHaveStyle({
      borderColor: `${testColor} transparent ${testColor} transparent`,
    });
  });

  it('applies additional className to container', () => {
    const { container } = render(<Loader className="custom-class" />);
    const wrapper = container.querySelector('.loader-container');
    expect(wrapper).toHaveClass('custom-class');
  });

  it('has accessible role and label', () => {
    const { getByRole } = render(<Loader />);
    const loader = getByRole('status');
    expect(loader).toHaveAttribute('aria-label', 'Loading');
  });
});
