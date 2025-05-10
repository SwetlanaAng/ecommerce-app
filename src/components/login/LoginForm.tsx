import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import Input from '../input/Input';
import { LoginInput } from '../../schemas/authSchemas';

interface LoginFormProps {
  formData: {
    email: string;
    password: string;
  };
  isDisabled: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  register: UseFormRegister<LoginInput>;
  errors: FieldErrors<LoginInput>;
}

const LoginForm: React.FC<LoginFormProps> = ({
  formData,
  isDisabled,
  onChange,
  register,
  errors,
}) => {
  return (
    <>
      <Input<LoginInput>
        id="email"
        register={register}
        labelText="Email"
        placeholder="user@example.com"
        autoComplete="on"
        disabled={isDisabled}
        name="email"
        value={formData.email}
        onChange={onChange}
        error={errors.email}
      />

      <Input<LoginInput>
        id="password"
        register={register}
        labelText="Password"
        placeholder="••••••••"
        type="password"
        disabled={isDisabled}
        name="password"
        value={formData.password}
        onChange={onChange}
        error={errors.password}
        autoComplete="off"
      />
    </>
  );
};

export default LoginForm;
