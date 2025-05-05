import './Select.css';

interface SelectProps {
  labelText: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  name: string;
  value: string;
  required: boolean;
  disabled: boolean;
  countryId: { [key: string]: string };
}

const Select = ({
  labelText,
  className,
  onChange,
  name,
  value,
  required,
  disabled,
  countryId,
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
          >
            {Object.keys(countryId).map(country => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
      </label>
    </div>
  );
};

export default Select;
