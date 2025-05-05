import './Checkbox.css';

interface CheckboxProps {
  type: string;
  labelText: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id: string;
  name?: string;
  disabled: boolean;
  checked: boolean;
}

const Checkbox = ({
  type,
  labelText,
  className,
  onChange,
  name,
  id,
  disabled,
  checked,
}: CheckboxProps) => {
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
};

export default Checkbox;
