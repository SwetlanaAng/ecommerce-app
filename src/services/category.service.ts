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

export async function getCategoriesNamesWithParent() {
  const categoriesData = await getCategories();
  if (!categoriesData) return [];

  const idToNameMap = new Map<string, string>();
  categoriesData.forEach((category: CategoryData) => {
    idToNameMap.set(category.id, category.name['en-US']);
  });

  return categoriesData.map((category: CategoryData) => {
    const name = category.name['en-US'];
    const parentId = category.parent?.id;
    const parentName = parentId ? idToNameMap.get(parentId) || null : null;

    return {
      name,
      parentName,
    };
  });
}
