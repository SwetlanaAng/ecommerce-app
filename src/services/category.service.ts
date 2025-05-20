import { getBasicToken } from './registration.service';
import { KEYS } from './keys';
import { CategoryData } from '../types/interfaces';

export async function getCategories() {
  const accessToken = await getBasicToken();
  const response = await fetch(`${KEYS.API_URL}/${KEYS.PROJECT_KEY}/categories/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) {
    return undefined;
  }
  const data = await response.json();
  return data.results;
}

export async function getCategoryHierarchy() {
  const categoriesData = await getCategories();
  if (!categoriesData) return [];

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
}

export async function getCategoryById(categoryId: string) {
  const categoriesData = await getCategories();
  if (!categoriesData) return null;

  return categoriesData.find((category: CategoryData) => category.id === categoryId) || null;
}

export async function getChildCategories(parentId: string) {
  const categoriesData = await getCategories();
  if (!categoriesData) return [];

  return categoriesData.filter((category: CategoryData) => category.parent?.id === parentId);
}

export interface CategoryPath {
  id: string;
  name: string;
}

export async function getCategoryPath(categoryId: string): Promise<CategoryPath[]> {
  const categoriesData = await getCategories();
  if (!categoriesData) return [];

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
}
