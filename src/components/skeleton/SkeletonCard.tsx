import './SkeletonCard.css';

interface SkeletonCardProps {
  count?: number;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ count = 1 }) => {
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <div key={index} className="skeleton-card">
          <div className="skeleton-image" />
          <div className="skeleton-content">
            <div className="skeleton-title" />
            <div className="skeleton-price" />
            <div className="skeleton-description">
              <div className="skeleton-line" />
              <div className="skeleton-line" />
            </div>
            {/* <div className="skeleton-button" /> */}
          </div>
        </div>
      ))}
    </>
  );
};

export default SkeletonCard;
