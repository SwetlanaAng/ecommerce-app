import { getBasicToken } from './registration.service';
import { KEYS } from './keys';
import { CategoryData } from '../types/interfaces';

export async function getCategoryId(key: string) {
  const accessToken = await getBasicToken();
  const response = await fetch(`${KEYS.API_URL}/${KEYS.PROJECT_KEY}/categories/key=${key}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) {
    return undefined;
  }
  const data = await response.json();
  return data.id;
}

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

export async function getCategoriesNames() {
  const categoriesData = await getCategories();
  return categoriesData.map((categoryData: CategoryData) => {
    const categoryName: string = categoryData.name.en;
    return categoryName[0].toUpperCase() + categoryName.slice(1);
  });
}
