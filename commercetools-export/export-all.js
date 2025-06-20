require('dotenv').config();
const fs = require('fs');
const fetch = require('node-fetch');
const { createClient } = require('@commercetools/sdk-client');
const {
  createAuthMiddlewareForClientCredentialsFlow,
} = require('@commercetools/sdk-middleware-auth');
const { createHttpMiddleware } = require('@commercetools/sdk-middleware-http');

global.fetch = fetch;

const { PROJECT_KEY, CLIENT_ID, CLIENT_SECRET, AUTH_URL, API_URL } = process.env;

const client = createClient({
  middlewares: [
    createAuthMiddlewareForClientCredentialsFlow({
      host: AUTH_URL,
      projectKey: PROJECT_KEY,
      credentials: {
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
      },
      fetch,
    }),
    createHttpMiddleware({
      host: API_URL,
      fetch,
    }),
  ],
});

async function exportData(entity, filename) {
  const limit = 100;
  let offset = 0;
  let allResults = [];
  let hasMore = true;

  while (hasMore) {
    const request = {
      uri: `/${PROJECT_KEY}/${entity}?limit=${limit}&offset=${offset}`,
      method: 'GET',
    };

    try {
      const response = await client.execute(request);
      allResults = allResults.concat(response.body.results);
      offset += limit;
      hasMore = response.body.total > offset;
    } catch (error) {
      console.error(`❌ Ошибка при экспорте ${entity}:`, error.message);
      return;
    }
  }

  fs.writeFileSync(filename, JSON.stringify(allResults, null, 2));
  console.log(`✅ Экспортировано ${allResults.length} записей из ${entity} в ${filename}`);
}

async function exportAll() {
  await exportData('products', 'products.json');
  await exportData('categories', 'categories.json');
  await exportData('product-types', 'product-types.json');
  await exportData('discount-codes', 'discount-codes.json');
  await exportData('standalone-prices', 'standalone-prices.json');
}

exportAll();
