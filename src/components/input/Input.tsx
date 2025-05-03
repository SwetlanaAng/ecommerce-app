import './Input.css';
interface InputProps {
  labelText: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  children?: React.ReactNode;
  type?: 'text' | 'email' | 'password' | 'date' | 'checkbox';
  placeholder: string;
  name: string;
  value: string;
  required: boolean;
  disabled: boolean;
  minLength?: number;
  autoComplete?: 'off' | 'on';
}

const Input = ({
  labelText,
  className,
  onChange,
  children,
  type = 'text',
  placeholder,
  name,
  value,
  required,
  disabled,
  minLength,
  autoComplete,
}: InputProps) => (
  <label htmlFor={name} className="label">
    <p>{labelText}</p>
    <input
      className={`${className ? className : ''} input`}
      id={name}
      name={name}
      onChange={onChange}
      type={type}
      placeholder={placeholder}
      value={value}
      required={required}
      disabled={disabled}
      minLength={minLength}
      autoComplete={autoComplete}
    >
      {children}
    </input>
  </label>
);

export default Input;
