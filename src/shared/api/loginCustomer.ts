import { CustomerSignin, ClientResponse, CustomerSignInResult } from '@commercetools/platform-sdk';
import { apiRoot } from './BuildClient';

const loginCustomer = async (
  loginData: CustomerSignin
): Promise<ClientResponse<CustomerSignInResult>> => {
  return apiRoot.login().post({ body: loginData }).execute();
};

export default loginCustomer;
