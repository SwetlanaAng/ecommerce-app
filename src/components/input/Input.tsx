import { useState } from 'react';
import view from '../../assets/view.png';
import hide from '../../assets/hide.png';
import './Input.css';
import { UseFormRegister, useForm } from 'react-hook-form';

export interface FormFields {
  /* [key: string]: string; */
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  date: string;
  billing_city: string;
  billing_street: string;
  billing_postalCode: string;
  default_billing: string;
  sameAsShipping: string;
  shipping_city: string;
  shipping_street: string;
  shipping_postalCode: string;
  default_shipping: string;
}
interface InputProps {
  labelText: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: 'text' | 'email' | 'password' | 'date' | 'checkbox';
  placeholder?: string;
  name: string;
  value?: string;
  id: /* string*/
  | 'email'
    | 'password'
    | 'date'
    | 'firstName'
    | 'lastName'
    | 'billing_city'
    | 'billing_street'
    | 'billing_postalCode'
    | 'default_billing'
    | 'sameAsShipping'
    | 'shipping_city'
    | 'shipping_street'
    | 'shipping_postalCode'
    | 'default_shipping';
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
    /* register, */ formState: { errors },
  } = useForm<FormFields>();
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
            {...register(id, {
              validate: value => {
                if (!value.includes('@')) {
                  return 'Huge mistake';
                }
                return true;
              },
            })}
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
      {}
      {errors[id] && <div> {errors[id]?.message}</div>}
    </div>
  );
};

export default Input;
