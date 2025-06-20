const fs = require('fs');
const path = require('path');

const products = JSON.parse(fs.readFileSync('./products.json', 'utf-8'));
const imageMap = JSON.parse(fs.readFileSync('./image-map.json', 'utf-8'));

function replaceImageUrls(variant) {
  if (!variant?.images) return;

  variant.images.forEach(image => {
    const originalUrl = image.url;
    if (imageMap[originalUrl]) {
      image.url = imageMap[originalUrl];
    }
  });
}

products.forEach(product => {
  const current = product.masterData?.current;
  if (!current) return;

  replaceImageUrls(current.masterVariant);

  current.variants.forEach(variant => replaceImageUrls(variant));
});

fs.writeFileSync('./products_local.json', JSON.stringify(products, null, 2));
console.log('✅ Новый файл сохранён: products_local.json');
