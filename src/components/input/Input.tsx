import { useState } from 'react';
import view from '../../assets/view.png';
import hide from '../../assets/hide.png';
import './Input.css';

interface InputProps {
  labelText: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: 'text' | 'email' | 'password' | 'date' | 'checkbox';
  placeholder?: string;
  name?: string;
  value?: string;
  id?: string;
  required?: boolean;
  disabled: boolean;
  minLength?: number;
  autoComplete?: 'off' | 'on';
  checked?: boolean;
}

const Input = ({
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
      <label htmlFor={name} className="label">
        <p className="label-text">{labelText}</p>
        <div className="input-wrapper">
          <input
            className={`${className ? className : ''} input`}
            id={name}
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
    </div>
  );
};

export default Input;
