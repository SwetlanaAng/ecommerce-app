import './Loader.css';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  size = 'medium',
  color = '#e7426a',
  className = '',
}) => {
  return (
    <div className={`loader-container ${className}`}>
      <div
        className={`loader ${size}`}
        style={{
          borderColor: `${color} transparent ${color} transparent`,
        }}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
};

export default Loader;
