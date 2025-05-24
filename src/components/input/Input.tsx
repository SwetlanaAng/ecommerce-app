import { useState } from 'react';
import view from '../../assets/view.png';
import hide from '../../assets/hide.png';
import searchIcon from '../../assets/search.png';
import './Input.css';
import { UseFormRegister, FieldError, Path } from 'react-hook-form';

export type InputName =
  | 'email'
  | 'password'
  | 'currentPassword'
  | 'newPassword'
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

interface InputProps<T extends Record<string, unknown>> {
  labelText?: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: 'text' | 'email' | 'password' | 'date' | 'number' | 'checkbox';
  placeholder?: string;
  name: Path<T>;
  value?: string;
  id: string;
  required?: boolean;
  disabled?: boolean;
  minLength?: number;
  min?: string;
  autoComplete?:
    | 'off'
    | 'on'
    | 'new-password'
    | 'current-password'
    | 'email'
    | 'name'
    | 'tel'
    | 'street-address'
    | 'postal-code'
    | 'address-level2'
    | 'address-level1'
    | 'country'
    | 'given-name'
    | 'family-name'
    | 'bday';
  checked?: boolean;
  register?: UseFormRegister<T>;
  error?: FieldError;
  defaultValue?: string;

  isSearchField?: boolean;
}

const Input = <T extends Record<string, unknown>>({
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
  min,
  autoComplete,
  id,
  checked,
  error,
  isSearchField,
}: InputProps<T>) => {
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
          {...register?.(name)}
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
        {labelText && <p className="label-text">{labelText}</p>}
        <div className={`input-wrapper ${isSearchField ? 'search-input-wrapper' : ''}`}>
          {isSearchField && <img src={searchIcon} alt="search" className="search-icon" />}
          <input
            {...register?.(name)}
            className={`${className ? className : ''} input ${error ? 'error' : ''} ${isSearchField ? 'search-input' : ''}`}
            id={id}
            name={name}
            onChange={onChange}
            type={inputType}
            placeholder={placeholder}
            value={value}
            required={required}
            disabled={disabled}
            min={min}
            minLength={minLength}
            autoComplete={autoComplete}
            aria-invalid={error ? 'true' : 'false'}
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
      {error && <div className="error-text">{error.message}</div>}
    </div>
  );
};

export default Input;
