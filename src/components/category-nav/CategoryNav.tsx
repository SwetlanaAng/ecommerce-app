import React from 'react';
import { CategoryWithChildren } from '../../types/interfaces';
import { useAppContext } from '../../features/app/hooks/useAppContext';
import './CategoryNav.css';

interface CategoryNavProps {
  onSelectCategory: (categoryId: string) => void;
  selectedCategoryId?: string;
}

const CategoryNav: React.FC<CategoryNavProps> = ({ onSelectCategory, selectedCategoryId }) => {
  const { categories, isLoading } = useAppContext();

  const renderCategoryItem = (category: CategoryWithChildren) => {
    const hasChildren = category.children && category.children.length > 0;
    const isSelected = selectedCategoryId === category.id;

    return (
      <li key={category.id} className="category-item">
        <div className="category-header">
          <span
            className={`category-name ${isSelected ? 'selected' : ''}`}
            onClick={() => onSelectCategory(category.id)}
          >
            {category.name['en-US']}
          </span>
        </div>

        {hasChildren && (
          <ul className="subcategory-list">
            {category.children.map(child => (
              <li key={child.id} className="subcategory-item">
                <span
                  className={`subcategory-name ${selectedCategoryId === child.id ? 'selected' : ''}`}
                  onClick={() => onSelectCategory(child.id)}
                >
                  {child.name['en-US']}
                </span>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  };

  if (isLoading) {
    return <div className="category-nav-loading">Loading categories...</div>;
  }

  return (
    <div className="category-nav">
      <h3 className="category-nav-title">Categories</h3>
      <ul className="category-list">{categories.map(category => renderCategoryItem(category))}</ul>
    </div>
  );
};

export default CategoryNav;
