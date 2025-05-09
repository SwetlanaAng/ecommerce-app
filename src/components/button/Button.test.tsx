import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button Component', () => {
  it('renders button with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Click me</Button>);
    const button = screen.getByText('Click me');
    expect(button).toHaveClass('custom-class');
    expect(button).toHaveClass('btn');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders disabled button', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDisabled();
  });

  it('renders button with different types', () => {
    const { rerender } = render(<Button type="submit">Submit</Button>);
    expect(screen.getByText('Submit')).toHaveAttribute('type', 'submit');

    rerender(<Button type="reset">Reset</Button>);
    expect(screen.getByText('Reset')).toHaveAttribute('type', 'reset');

    rerender(<Button type="button">Button</Button>);
    expect(screen.getByText('Button')).toHaveAttribute('type', 'button');
  });

  it('does not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(
      <Button onClick={handleClick} disabled>
        Click me
      </Button>
    );

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
