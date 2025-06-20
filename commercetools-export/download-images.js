const fs = require('fs-extra');
const path = require('path');
const fetch = require('node-fetch');

const products = require('./products.json');
const outputDir = path.join(__dirname, 'images');
const imageMap = {};

async function downloadImage(url, filename) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Ошибка загрузки ${url}: ${res.statusText}`);

  const dest = path.join(outputDir, filename);
  const stream = fs.createWriteStream(dest);
  await new Promise((resolve, reject) => {
    res.body.pipe(stream);
    res.body.on('error', reject);
    stream.on('finish', resolve);
  });
}

function extractImages(product) {
  const images = [];

  const variants = [
    product.masterData?.current?.masterVariant,
    ...(product.masterData?.current?.variants || []),
  ];

  variants.forEach(variant => {
    if (variant?.images) {
      images.push(...variant.images);
    }
  });

  return images;
}

(async () => {
  await fs.ensureDir(outputDir);

  const seen = new Set();
  let count = 0;

  for (const product of products) {
    const images = extractImages(product);
    for (const image of images) {
      const url = image.url;
      const filename = path.basename(url);

      if (seen.has(url)) continue;
      seen.add(url);

      try {
        await downloadImage(url, filename);
        imageMap[url] = `images/${filename}`;
        console.log(`✅ Скачано: ${filename}`);
        count++;
      } catch (err) {
        console.error(`❌ Ошибка при скачивании ${url}: ${err.message}`);
      }
    }
  }

  fs.writeFileSync('image-map.json', JSON.stringify(imageMap, null, 2));
  console.log(`\n🎉 Всего изображений скачано: ${count}`);
})();
