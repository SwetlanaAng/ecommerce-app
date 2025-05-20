import React, { useState, useEffect } from 'react';
import { CategoryData } from '../../types/interfaces';
import { getCategoryHierarchy } from '../../services/category.service';
import './CategoryNav.css';

interface CategoryNavProps {
  onSelectCategory: (categoryId: string) => void;
  selectedCategoryId?: string;
}

interface CategoryWithChildren extends CategoryData {
  children: CategoryWithChildren[];
}

const CategoryNav: React.FC<CategoryNavProps> = ({ onSelectCategory, selectedCategoryId }) => {
  const [categories, setCategories] = useState<CategoryWithChildren[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategoryHierarchy();
        setCategories(categoriesData as CategoryWithChildren[]);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const renderCategoryItem = (category: CategoryWithChildren) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories[category.id];
    const isSelected = selectedCategoryId === category.id;

    return (
      <li key={category.id} className="category-item">
        <div className="category-header">
          {hasChildren && (
            <button
              className={`expand-button ${isExpanded ? 'expanded' : ''}`}
              onClick={() => toggleCategory(category.id)}
              aria-label={isExpanded ? 'Collapse category' : 'Expand category'}
            >
              {isExpanded ? '−' : '+'}
            </button>
          )}
          <span
            className={`category-name ${isSelected ? 'selected' : ''}`}
            onClick={() => onSelectCategory(category.id)}
          >
            {category.name['en-US']}
          </span>
        </div>

        {hasChildren && isExpanded && (
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

  if (loading) {
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
