const path = require('path');
const fs = require('fs');
const sharp = require(path.join(__dirname, '../node_modules/sharp'));

const inputPath = 'C:/Users/ABRAHAM SAMUEL/.gemini/antigravity-ide/brain/9a8173ae-e71b-41fa-8f2c-cd289b55d23c/.user_uploaded/media_1787996859568.png';
const publicJpg = path.join(__dirname, '../public/og-image.jpg');
const publicPng = path.join(__dirname, '../public/og-image.png');

async function processImages() {
  console.log('Processing JPG (1200x630, web & social media optimized)...');
  const jpgBuffer = await sharp(inputPath)
    .resize(1200, 630, {
      fit: 'contain',
      background: { r: 251, g: 253, b: 255, alpha: 1 },
      kernel: sharp.kernel.lanczos3
    })
    .sharpen({ sigma: 1.0, m1: 0.5, m2: 1.5 })
    .jpeg({
      quality: 88,
      mozjpeg: true,
      progressive: true,
      chromaSubsampling: '4:4:4'
    })
    .toBuffer();

  fs.writeFileSync(publicJpg, jpgBuffer);

  console.log('Processing PNG (1200x630, palette compressed)...');
  const pngBuffer = await sharp(inputPath)
    .resize(1200, 630, {
      fit: 'contain',
      background: { r: 251, g: 253, b: 255, alpha: 1 },
      kernel: sharp.kernel.lanczos3
    })
    .sharpen({ sigma: 1.0, m1: 0.5, m2: 1.5 })
    .png({
      quality: 90,
      compressionLevel: 9,
      palette: true
    })
    .toBuffer();

  fs.writeFileSync(publicPng, pngBuffer);

  const statJpg = fs.statSync(publicJpg);
  const statPng = fs.statSync(publicPng);
  const metaJpg = await sharp(publicJpg).metadata();
  const metaPng = await sharp(publicPng).metadata();

  console.log('Generated og-image.jpg:', {
    sizeKB: (statJpg.size / 1024).toFixed(2) + ' KB',
    width: metaJpg.width,
    height: metaJpg.height,
    format: metaJpg.format,
    progressive: metaJpg.isProgressive
  });
  console.log('Generated og-image.png:', {
    sizeKB: (statPng.size / 1024).toFixed(2) + ' KB',
    width: metaPng.width,
    height: metaPng.height,
    format: metaPng.format
  });
}

processImages().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
