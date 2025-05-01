import {
  ClientBuilder,
  type AuthMiddlewareOptions,
  type HttpMiddlewareOptions,
} from '@commercetools/ts-client';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';

const projectKey = 'gitinitshop';
const clientId = 'xretPewcCVqHa-D-478PaIQ3';
const clientSecret = 'Z-bbHsxBGYarShxah3q7deHpa4zZeM0x';
const authUrl = 'https://auth.us-east-2.aws.commercetools.com';
const apiUrl = 'https://api.us-east-2.aws.commercetools.com';

const scopes = ['manage_customers:gitinitshop'];

const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: authUrl,
  projectKey,
  credentials: {
    clientId,
    clientSecret,
  },
  scopes,
  httpClient: fetch,
};

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: apiUrl,
  httpClient: fetch,
};

const ctpClient = new ClientBuilder()
  .withProjectKey(projectKey)
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware()
  .build();

export const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({ projectKey });
