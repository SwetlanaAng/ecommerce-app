import { CustomerDraft } from '@commercetools/platform-sdk';
import { apiRoot } from './BuildClient';

export const createCustomer = async (customerData: CustomerDraft) => {
  try {
    const response = await apiRoot.customers().post({ body: customerData }).execute();
    console.log('✅ Покупатель создан:', response.body);
    return response.body;
  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ Ошибка при создании покупателя:', error.message);
    } else {
      console.error('❌ Неизвестная ошибка:', error);
    }
    throw error;
  }
};
