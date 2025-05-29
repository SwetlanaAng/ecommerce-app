import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from './LoginForm';
import { UseFormRegister } from 'react-hook-form';
import { LoginInput } from '../../schemas/authSchemas';

const mockRegister = jest.fn(() => ({ onChange: jest.fn(), onBlur: jest.fn(), ref: jest.fn() }));

describe('LoginForm', () => {
  const formData = {
    email: '',
    password: '',
  };

  const errors = {};

  const onChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders email and password inputs with correct props', () => {
    render(
      <LoginForm
        formData={formData}
        isDisabled={false}
        onChange={onChange}
        register={mockRegister as unknown as UseFormRegister<LoginInput>}
        errors={errors}
      />
    );

    const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;

    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('placeholder', 'user@example.com');
    expect(emailInput).toHaveValue('');
    expect(emailInput).not.toBeDisabled();

    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute('placeholder', '••••••••');
    expect(passwordInput).toHaveValue('');
    expect(passwordInput).not.toBeDisabled();
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('disables inputs when isDisabled is true', () => {
    render(
      <LoginForm
        formData={formData}
        isDisabled={true}
        onChange={onChange}
        register={mockRegister as unknown as UseFormRegister<LoginInput>}
        errors={errors}
      />
    );

    expect(screen.getByLabelText('Email')).toBeDisabled();
    expect(screen.getByLabelText('Password')).toBeDisabled();
  });

  it('calls onChange handler when typing in inputs', () => {
    render(
      <LoginForm
        formData={formData}
        isDisabled={false}
        onChange={onChange}
        register={mockRegister as unknown as UseFormRegister<LoginInput>}
        errors={errors}
      />
    );

    const emailInput = screen.getByLabelText('Email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(onChange).toHaveBeenCalledTimes(1);

    const passwordInput = screen.getByLabelText('Password');
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('displays error messages if errors are provided', () => {
    const errorMsgEmail = 'Email is required';
    const errorMsgPassword = 'Password is required';

    render(
      <LoginForm
        formData={formData}
        isDisabled={false}
        onChange={onChange}
        register={mockRegister as unknown as UseFormRegister<LoginInput>}
        errors={{
          email: { message: errorMsgEmail, type: 'required' },
          password: { message: errorMsgPassword, type: 'required' },
        }}
      />
    );

    expect(screen.getByText(errorMsgEmail)).toBeInTheDocument();
    expect(screen.getByText(errorMsgPassword)).toBeInTheDocument();
  });
});
