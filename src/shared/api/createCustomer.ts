import { apiRoot } from './BuildClient';
import { CustomerDraft, CustomerSignInResult, ClientResponse } from '@commercetools/platform-sdk';

const createCustomer = (
  newCustomerData: CustomerDraft
): Promise<ClientResponse<CustomerSignInResult>> => {
  return apiRoot
    .customers()
    .post({
      body: newCustomerData,
    })
    .execute();
};

export default createCustomer;
