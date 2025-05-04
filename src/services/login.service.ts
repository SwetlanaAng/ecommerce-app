import { KEYS } from './keys';
import { TokenResponse, Customer } from '../types/interfaces';

const BASE_AUTH_URL = KEYS.AUTH_URL;
const BASE_URL = KEYS.API_URL;
const projectKey = KEYS.PROJECT_KEY;
const clientID = KEYS.CLIENT_ID;
const secret = KEYS.CLIENT_SECRET;

const HEADERS = {
  Authorization: 'Basic ' + btoa(`${clientID}:${secret}`),
  'Content-Type': 'application/x-www-form-urlencoded',
};

export function getToken(username: string, password: string): Promise<TokenResponse> {
  const params = new URLSearchParams();
  params.append('grant_type', 'password');
  params.append('username', username);
  params.append('password', password);

  return fetch(`${BASE_AUTH_URL}/oauth/${projectKey}/customers/token`, {
    method: 'POST',
    headers: HEADERS,
    body: params,
  }).then(response => {
    if (!response.ok) {
      throw new Error('Authentication failed');
    }
    return response.json();
  });
}

export function login(email: string, password: string): Promise<Customer> {
  const tokenData = JSON.parse(localStorage.getItem('token') || '{}') as TokenResponse;
  const token = tokenData.access_token;

  if (!token) {
    throw new Error('No authentication token found');
  }

  return fetch(`${BASE_URL}/${projectKey}/login`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  }).then(response => {
    if (!response.ok) {
      throw new Error('Login failed');
    }
    return response.json();
  });
}

export function refreshToken(): Promise<TokenResponse> {
  const tokenData = JSON.parse(localStorage.getItem('token') || '{}') as TokenResponse;
  const refreshToken = tokenData.refresh_token;

  if (!refreshToken) {
    throw new Error('No refresh token found');
  }

  const params = new URLSearchParams();
  params.append('grant_type', 'refresh_token');
  params.append('refresh_token', refreshToken);

  return fetch(`${BASE_AUTH_URL}/oauth/${projectKey}/customers/token`, {
    method: 'POST',
    headers: HEADERS,
    body: params,
  }).then(response => {
    if (!response.ok) {
      throw new Error('Token refresh failed');
    }
    return response.json();
  });
}
