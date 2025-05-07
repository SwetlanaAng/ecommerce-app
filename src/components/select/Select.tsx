import './Select.css';

interface SelectProps {
  labelText: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  name: string;
  value: string;
  required: boolean;
  disabled: boolean;
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
        <p className="label-text">{labelText}</p>
        <div className="select-wrapper">
          <select
            className={className}
            id={name}
            name={name}
            onChange={onChange}
            value={value}
            required={required}
            disabled={disabled}
            autoComplete={autoComplete}
          >
            {Object.keys(optionsList).map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </label>
    </div>
  );
};

export default Select;
