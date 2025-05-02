import {
  ClientBuilder,
  type AuthMiddlewareOptions,
  type HttpMiddlewareOptions,
} from '@commercetools/ts-client';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { KEYS } from './keys';

const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: KEYS.AUTH_URL,
  projectKey: KEYS.PROJECT_KEY,
  credentials: {
    clientId: KEYS.CLIENT_ID,
    clientSecret: KEYS.CLIENT_SECRET,
  },
  scopes: KEYS.SCOPES,
  httpClient: fetch,
};

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: KEYS.API_URL,
  httpClient: fetch,
};

const ctpClient = new ClientBuilder()
  .withProjectKey(KEYS.PROJECT_KEY)
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware()
  .build();

export const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
  projectKey: KEYS.PROJECT_KEY,
});
