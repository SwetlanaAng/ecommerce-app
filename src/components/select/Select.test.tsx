import { render, screen, fireEvent } from '@testing-library/react';
import Select from './Select';

describe('Select Component', () => {
  const mockOptions = {
    option1: 'Option 1',
    option2: 'Option 2',
    option3: 'Option 3',
  };

  const noop = () => {};

  it('renders select with label', () => {
    render(
      <Select
        labelText="Test Select"
        name="test"
        value="option1"
        required={false}
        disabled={false}
        optionsList={mockOptions}
        onChange={noop}
      />
    );
    expect(screen.getByLabelText('Test Select')).toBeInTheDocument();
  });

  it('renders all options', () => {
    render(
      <Select
        labelText="Test Select"
        name="test"
        value="option1"
        required={false}
        disabled={false}
        optionsList={mockOptions}
        onChange={noop}
      />
    );

    const select = screen.getByLabelText('Test Select');
    expect(select).toHaveValue('option1');

    Object.values(mockOptions).forEach(option => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });

  it('handles onChange event', () => {
    const handleChange = jest.fn();
    render(
      <Select
        labelText="Test Select"
        name="test"
        value="option1"
        required={false}
        disabled={false}
        optionsList={mockOptions}
        onChange={handleChange}
      />
    );

    const select = screen.getByLabelText('Test Select');
    fireEvent.change(select, { target: { value: 'option2' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('applies custom className', () => {
    render(
      <Select
        labelText="Test Select"
        name="test"
        value="option1"
        required={false}
        disabled={false}
        optionsList={mockOptions}
        className="custom-class"
        onChange={noop}
      />
    );

    expect(screen.getByLabelText('Test Select')).toHaveClass('custom-class');
  });

  it('handles disabled state', () => {
    render(
      <Select
        labelText="Test Select"
        name="test"
        value="option1"
        required={false}
        disabled={true}
        optionsList={mockOptions}
        onChange={noop}
      />
    );

    expect(screen.getByLabelText('Test Select')).toBeDisabled();
  });

  it('handles required state', () => {
    render(
      <Select
        labelText="Test Select"
        name="test"
        value="option1"
        required={true}
        disabled={false}
        optionsList={mockOptions}
        onChange={noop}
      />
    );

    expect(screen.getByLabelText('Test Select')).toBeRequired();
  });

  it('handles autoComplete attribute', () => {
    render(
      <Select
        labelText="Test Select"
        name="test"
        value="option1"
        required={false}
        disabled={false}
        optionsList={mockOptions}
        autoComplete="country"
        onChange={noop}
      />
    );

    expect(screen.getByLabelText('Test Select')).toHaveAttribute('autocomplete', 'country');
  });
});
