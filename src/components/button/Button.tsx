import './Button.css';

interface ButtonProps {
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const Button = ({ className, onClick, children, disabled, type = 'button' }: ButtonProps) => (
  <button
    className={`${className ? className : ''} btn`}
    onClick={onClick}
    disabled={disabled}
    type={type}
  >
    {children}
  </button>
);

export default Button;
