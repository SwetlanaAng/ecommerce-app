import './Select.css';

interface SelectProps {
  labelText?: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  name: string;
  value?: string;
  required?: boolean;
  disabled?: boolean;
  optionsList: { [key: string]: string };
  autoComplete?: 'country' | 'country-name';
}

const Select = ({
  labelText,
  className,
  onChange,
  name,
  value,
  required,
  disabled,
  optionsList,
  autoComplete,
}: SelectProps) => {
  return (
    <div className="form-group">
      <label htmlFor={name} className="label">
        {labelText && <p className="label-text">{labelText}</p>}
        <div className="select-wrapper">
          <select
            className={`select ${className ? className : ''}`}
            id={name}
            name={name}
            onChange={onChange}
            value={value}
            required={required}
            disabled={disabled}
            autoComplete={autoComplete}
          >
            {Object.entries(optionsList).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
          <svg
            className="select-dropdown-icon"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.5 6.75L9 11.25L13.5 6.75"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </label>
    </div>
  );
};

export default Select;
