import { CategoryData } from '../types/interfaces';
import { getCategoriesData } from './local-data.service';

export async function getCategories(): Promise<CategoryData[]> {
  try {
    return getCategoriesData();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function getCategoryHierarchy(): Promise<
  (CategoryData & { children: CategoryData[] })[]
> {
  try {
    const categoriesData = getCategoriesData();
    const categoriesMap = new Map<string, CategoryData & { children: CategoryData[] }>();

    categoriesData.forEach((category: CategoryData) => {
      categoriesMap.set(category.id, { ...category, children: [] });
    });

    const rootCategories: (CategoryData & { children: CategoryData[] })[] = [];

    categoriesData.forEach((category: CategoryData) => {
      if (category.parent?.id) {
        const parent = categoriesMap.get(category.parent.id);
        if (parent) {
          parent.children.push(categoriesMap.get(category.id) || category);
        }
      } else {
        rootCategories.push(categoriesMap.get(category.id) || { ...category, children: [] });
      }
    });

    return rootCategories;
  } catch (error) {
    console.error('Error fetching category hierarchy:', error);
    return [];
  }
}

export async function getCategoryById(categoryId: string): Promise<CategoryData | null> {
  try {
    const categoriesData = getCategoriesData();
    return categoriesData.find((category: CategoryData) => category.id === categoryId) || null;
  } catch (error) {
    console.error('Error fetching category by id:', error);
    return null;
  }
}

export async function getChildCategories(parentId: string): Promise<CategoryData[]> {
  try {
    const categoriesData = getCategoriesData();
    return categoriesData.filter((category: CategoryData) => category.parent?.id === parentId);
  } catch (error) {
    console.error('Error fetching child categories:', error);
    return [];
  }
}

export interface CategoryPath {
  id: string;
  name: string;
}

export async function getCategoryPath(categoryId: string): Promise<CategoryPath[]> {
  try {
    const categoriesData = getCategoriesData();
    const path: CategoryPath[] = [];
    let currentCategory = categoriesData.find((cat: CategoryData) => cat.id === categoryId);

    while (currentCategory) {
      path.unshift({
        id: currentCategory.id,
        name: currentCategory.name['en-US'],
      });

      if (currentCategory.parent?.id) {
        currentCategory = categoriesData.find(
          (cat: CategoryData) => cat.id === currentCategory?.parent?.id
        );
      } else {
        currentCategory = undefined;
      }
    }

    return path;
  } catch (error) {
    console.error('Error fetching category path:', error);
    return [];
  }
}
