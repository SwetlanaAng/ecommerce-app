import { getToken, login } from './login.service';
import { Customer } from '../types/interfaces';

export default function handleLogin(email: string, password: string): Promise<Customer> {
  return getToken(email, password)
    .then(authData => {
      localStorage.setItem('token', JSON.stringify(authData));
      return login(email, password);
    })
    .then(userData => {
      localStorage.setItem('user', JSON.stringify(userData));

      return {
        id: userData.id || email,
        email: email,
        firstName: userData.firstName,
        lastName: userData.lastName,
      };
    })
    .catch(err => {
      console.error('Login failed:', err);
      throw err;
    });
}
