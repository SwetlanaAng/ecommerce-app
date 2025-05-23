import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Breadcrumbs.css';
import { CategoryPath } from '../../services/category.service';

interface BreadcrumbsProps {
  categoryPath?: CategoryPath[];
  currentCategory?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ categoryPath = [], currentCategory }) => {
  const navigate = useNavigate();

  const navigateToCategory = (categoryId: string) => {
    navigate(`/catalog?category=${categoryId}`);
  };

  return (
    <div className="breadcrumbs">
      <span className="breadcrumb-item" onClick={() => navigate('/')}>
        Main
      </span>
      <span className="breadcrumb-separator">/</span>
      <span
        className={`breadcrumb-item ${!categoryPath.length && !currentCategory ? 'active' : ''}`}
        onClick={() => navigate('/catalog')}
      >
        Catalog
      </span>

      {categoryPath &&
        categoryPath.map((category, index) => (
          <React.Fragment key={category.id}>
            <span className="breadcrumb-separator">/</span>
            <span
              className={`breadcrumb-item ${index === categoryPath.length - 1 && !currentCategory ? 'active' : ''}`}
              onClick={() => navigateToCategory(category.id)}
            >
              {category.name}
            </span>
          </React.Fragment>
        ))}

      {currentCategory && (
        <React.Fragment>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-item active">{currentCategory}</span>
        </React.Fragment>
      )}
    </div>
  );
};

export default Breadcrumbs;
