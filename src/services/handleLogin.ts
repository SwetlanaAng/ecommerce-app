import { getToken, login } from './login.service';
import { Customer } from '../types/interfaces';

interface LoginResponse {
  customer: Customer;
  [key: string]: unknown;
}

export default function handleLogin(email: string, password: string): Promise<Customer> {
  return getToken(email, password)
    .then(authData => {
      localStorage.setItem('token', JSON.stringify(authData));
      return login(email, password);
    })
    .then((loginResponse: LoginResponse) => {
      if (loginResponse.customer) {
        localStorage.setItem('login', JSON.stringify(loginResponse.customer));
      } else {
        localStorage.setItem('login', JSON.stringify(loginResponse));
      }

      return {
        id: loginResponse.customer?.id || email,
        email: email,
        firstName: loginResponse.customer?.firstName,
        lastName: loginResponse.customer?.lastName,
      };
    })
    .catch(err => {
      console.error('Login failed:', err);
      throw err;
    });
}
