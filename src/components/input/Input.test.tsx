import { render, screen, fireEvent } from '@testing-library/react';
import { useForm, UseFormRegister } from 'react-hook-form';
import Input from './Input';

jest.mock('../../assets/view.png', () => 'view-icon');
jest.mock('../../assets/hide.png', () => 'hide-icon');

const FormWrapper = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm();
  return <form {...methods}>{children}</form>;
};

describe('Input Component', () => {
  const mockRegister = (() => ({
    onChange: jest.fn(),
    onBlur: jest.fn(),
    name: 'test' as const,
    ref: jest.fn(),
  })) as unknown as UseFormRegister<Record<string, unknown>>;

  it('renders text input with label', () => {
    render(
      <FormWrapper>
        <Input labelText="Username" name="username" id="username" register={mockRegister} />
      </FormWrapper>
    );
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
  });

  it('renders password input with toggle visibility', () => {
    render(
      <FormWrapper>
        <Input
          labelText="Password"
          name="password"
          id="password"
          type="password"
          register={mockRegister}
        />
      </FormWrapper>
    );

    const passwordInput = screen.getByLabelText('Password');
    expect(passwordInput).toHaveAttribute('type', 'password');

    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
  });

  it('renders checkbox input', () => {
    render(
      <FormWrapper>
        <Input
          labelText="Remember me"
          name="remember"
          id="remember"
          type="checkbox"
          register={mockRegister}
        />
      </FormWrapper>
    );

    const checkbox = screen.getByLabelText('Remember me');
    expect(checkbox).toHaveAttribute('type', 'checkbox');
  });

  it('displays error message when error prop is provided', () => {
    const error = { message: 'This field is required', type: 'required' };
    render(
      <FormWrapper>
        <Input
          labelText="Email"
          name="email"
          id="email"
          type="email"
          register={mockRegister}
          error={error}
        />
      </FormWrapper>
    );

    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toHaveClass('error');
  });

  it('applies custom className', () => {
    render(
      <FormWrapper>
        <Input
          labelText="Custom Input"
          name="custom"
          id="custom"
          className="custom-class"
          register={mockRegister}
        />
      </FormWrapper>
    );

    expect(screen.getByLabelText('Custom Input')).toHaveClass('custom-class');
  });

  it('handles disabled state', () => {
    render(
      <FormWrapper>
        <Input
          labelText="Disabled Input"
          name="disabled"
          id="disabled"
          disabled
          register={mockRegister}
        />
      </FormWrapper>
    );

    expect(screen.getByLabelText('Disabled Input')).toBeDisabled();
  });

  it('handles required state', () => {
    render(
      <FormWrapper>
        <Input
          labelText="Required Input"
          name="required"
          id="required"
          required
          register={mockRegister}
        />
      </FormWrapper>
    );

    expect(screen.getByLabelText('Required Input')).toBeRequired();
  });

  it('handles onChange event', () => {
    const handleChange = jest.fn();
    render(
      <FormWrapper>
        <Input
          labelText="Change Input"
          name="change"
          id="change"
          onChange={handleChange}
          register={mockRegister}
        />
      </FormWrapper>
    );

    const input = screen.getByLabelText('Change Input');
    fireEvent.change(input, { target: { value: 'new value' } });
    expect(handleChange).toHaveBeenCalled();
  });
});
