import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Breadcrumbs.css';

interface BreadcrumbsProps {
  categories: string[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ categories }) => {
  const navigate = useNavigate();
  return (
    <div className="breadcrumbs">
      <span className="breadcrumb-item" onClick={() => navigate('/')}>
        Main
      </span>
      <span className="breadcrumb-separator">/</span>
      <span
        className={`breadcrumb-item ${categories.length === 0 ? 'active' : ''}`}
        onClick={() => navigate('/catalog')}
      >
        Catalog
      </span>
      {categories.map((category, index) => (
        <React.Fragment key={category}>
          <span className="breadcrumb-separator">/</span>
          <span className={`breadcrumb-item ${index === categories.length - 1 ? 'active' : ''}`}>
            {category}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumbs;
