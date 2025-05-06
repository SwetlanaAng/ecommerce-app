import { useState } from 'react';
import view from '../../assets/view.png';
import hide from '../../assets/hide.png';
import './Input.css';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { UseFormRegister, useForm } from 'react-hook-form';
import { formSchema } from './signInSchema';

export type FormFields = z.infer<typeof formSchema>;
interface InputProps {
  labelText: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: 'text' | 'email' | 'password' | 'date' | 'checkbox';
  placeholder?: string;
  name:
    | 'email'
    | 'password'
    | 'dateOfBirth'
    | 'firstName'
    | 'lastName'
    | 'billing_city'
    | 'billing_street'
    | 'billing_postalCode'
    | 'billing_isDefault'
    | 'sameAsShipping'
    | 'shipping_city'
    | 'shipping_street'
    | 'shipping_postalCode'
    | 'shipping_isDefault';
  value?: string;
  id: string;

  required?: boolean;
  disabled?: boolean;
  minLength?: number;
  autoComplete?: 'off' | 'on';
  checked?: boolean;
  register: UseFormRegister<FormFields>;
}

const Input = ({
  register,
  labelText,
  className,
  onChange,
  type = 'text',
  placeholder,
  name,
  value,
  required,
  disabled,
  minLength,
  autoComplete,
  id,
  checked,
}: InputProps) => {
  const {
    formState: { errors },
  } = useForm<FormFields>({ resolver: zodResolver(formSchema) });
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = type === 'password';
  const inputType = isPasswordField && showPassword ? 'text' : type;
  if (type === 'checkbox') {
    return (
      <div className="form-group checkbox-group">
        <input
          type={type}
          className={className}
          id={id}
          name={name}
          onChange={onChange}
          disabled={disabled}
          checked={checked}
        />
        <label htmlFor={id} className="label">
          {labelText}
        </label>
      </div>
    );
  }
  return (
    <div className="form-group">
      <label htmlFor={id} className="label">
        <p className="label-text">{labelText}</p>
        <div className="input-wrapper">
          <input
            {...register(
              name /* , {
                validate: value => {
                    if (typeof value !== 'string') {
                        console.log(errors)
                  return false;
                }
                return true;
              },
            } */
            )}
            className={`${className ? className : ''} input`}
            id={id}
            name={name}
            onChange={onChange}
            type={inputType}
            placeholder={placeholder}
            value={value}
            required={required}
            disabled={disabled}
            minLength={minLength}
            autoComplete={autoComplete}
            aria-invalid={errors[name] ? 'true' : 'false'}
          />
          {isPasswordField && (
            <button
              type="button"
              className="toggle-visibility"
              onClick={() => setShowPassword(prev => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <img src={view} alt="view" /> : <img src={hide} alt="hide" />}
            </button>
          )}
        </div>
      </label>

      {errors[name] && <div> {errors[name]?.message}</div>}
    </div>
  );
};

export default Input;
