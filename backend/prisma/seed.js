

import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const DATA_ROOT = path.resolve(
  __dirname,
  '../../products'
);
const PUBLIC_ROOT = path.resolve(__dirname, '../public');
const PRODUCTS_PUBLIC = path.join(PUBLIC_ROOT, 'products');
const BRANDS_PUBLIC = path.join(PUBLIC_ROOT, 'brands');


const CATEGORY_MAP = {
  '1- CPUs (10-2)':              { name: 'CPUs',               slug: 'cpus' },
  '2- motherboards (15-2)':      { name: 'Motherboards',        slug: 'motherboards' },
  '3-RAM (9-2)':                 { name: 'RAM',                 slug: 'ram' },
  '4-storages (18-4)':           { name: 'Storage',             slug: 'storage' },
  '5- GPUs (13-2)':              { name: 'GPUs',                slug: 'gpus' },
  '6- cooling (14-4)':           { name: 'Cooling',             slug: 'cooling' },
  '7- Computer cases (6-0)':     { name: 'Computer Cases',      slug: 'computer-cases' },
  '8- laptops (14-4)':           { name: 'Laptops',             slug: 'laptops' },
  '9- Accessories (12-4)':       { name: 'Accessories',         slug: 'accessories' },
  '10- monitors (6-5)':          { name: 'Monitors',            slug: 'monitors' },
  '11- prebult computers (3-3)': { name: 'Prebuilt Computers',  slug: 'prebuilt-computers' },
};



/** Recursively ensure a directory exists */
function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

/** Copy a file, creating dest directory if needed */
function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

/** Slugify a brand name for use in URLs and DB slug field */
function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

/** Valid image extensions */
const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif']);

/**
 * Parse a product's detials.txt file.
 * Returns { name, price, description }
 */
function parseDetails(filePath) {
  let raw;
  try {
    raw = fs.readFileSync(filePath, 'utf-8');
  } catch {
    return null;
  }

  
  const text = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  
  const nameMatch    = text.match(/product\s+name\s*:\s*([\s\S]*?)(?=price\s*:|$)/i);
  const priceMatch   = text.match(/price\s*:\s*([\s\S]*?)(?=details\s*:|$)/i);
  const detailsMatch = text.match(/details\s*:\s*([\s\S]*)/i);

  const rawName  = nameMatch   ? nameMatch[1].trim()   : '';
  const rawPrice = priceMatch  ? priceMatch[1].trim()  : '0';
  const rawDesc  = detailsMatch ? detailsMatch[1].trim() : '';

  
  const name = rawName.split('\n').map(l => l.trim()).filter(Boolean)[0] || '';

  
  const priceNum = parseFloat(rawPrice.replace(/[^0-9.]/g, '')) || 0;

  
  const description = rawDesc.split('\n').map(l => l.trim()).filter(Boolean).join('\n');

  return { name, price: priceNum, description };
}

/**
 * Get all image files in a directory (non-recursive, sorted by filename).
 */
function getImages(dirPath) {
  try {
    return fs.readdirSync(dirPath)
      .filter(f => IMAGE_EXTS.has(path.extname(f).toLowerCase()))
      .sort();
  } catch {
    return [];
  }
}


async function main() {
  console.log('🌱 Starting seed...\n');

  if (!fs.existsSync(DATA_ROOT)) {
    console.error(`❌ Data root not found: ${DATA_ROOT}`);
    process.exit(1);
  }

  ensureDir(PRODUCTS_PUBLIC);
  ensureDir(BRANDS_PUBLIC);

  
  console.log('📦 Seeding categories...');
  const categoryRecords = {}; 

  for (const [folderName, { name, slug }] of Object.entries(CATEGORY_MAP)) {
    const cat = await prisma.category.upsert({
      where: { slug },
      update: { name },
      create: { name, slug },
    });
    categoryRecords[folderName] = cat;
    console.log(`  ✔ Category: ${cat.name} (id=${cat.id})`);
  }

  
  console.log('\n🏷️  Seeding brands...');
  const brandsFolder = path.join(DATA_ROOT, 'brands (16-16)');
  const brandRecords = {}; 

  if (fs.existsSync(brandsFolder)) {
    const brandDirs = fs.readdirSync(brandsFolder).filter(d =>
      fs.statSync(path.join(brandsFolder, d)).isDirectory()
    );

    for (const brandDirName of brandDirs) {
      const brandName = brandDirName; 
      const slug = slugify(brandName);
      const brandSrcDir = path.join(brandsFolder, brandDirName);
      const brandDestDir = path.join(BRANDS_PUBLIC, slug);

      
      const logoFiles = getImages(brandSrcDir);
      let logoUrl = null;
      if (logoFiles.length > 0) {
        const srcLogo = path.join(brandSrcDir, logoFiles[0]);
        const destLogo = path.join(brandDestDir, logoFiles[0]);
        copyFile(srcLogo, destLogo);
        logoUrl = `/uploads/brands/${slug}/${logoFiles[0]}`;
      }

      const brand = await prisma.brand.upsert({
        where: { slug },
        update: { name: brandName, logoUrl },
        create: { name: brandName, slug, logoUrl },
      });

      brandRecords[brandName.toLowerCase()] = brand;
      console.log(`  ✔ Brand: ${brand.name} (id=${brand.id})`);
    }
  }

  
  console.log('\n🖥️  Seeding products...');
  let productCount = 0;
  let imageCount   = 0;
  let skipped      = 0;

  for (const [catFolderName, categoryRecord] of Object.entries(categoryRecords)) {
    const catPath = path.join(DATA_ROOT, catFolderName);
    if (!fs.existsSync(catPath)) continue;

    
    const catContents = fs.readdirSync(catPath);

    for (const brandOrProductDir of catContents) {
      const bopPath = path.join(catPath, brandOrProductDir);
      if (!fs.statSync(bopPath).isDirectory()) continue;

      
      const bopContents = fs.readdirSync(bopPath);
      const hasSubDirs = bopContents.some(item =>
        fs.statSync(path.join(bopPath, item)).isDirectory()
      );

      if (hasSubDirs) {
        
        const brandName = brandOrProductDir;
        const brandRecord = brandRecords[brandName.toLowerCase()] || null;

        for (const productDir of bopContents) {
          const productPath = path.join(bopPath, productDir);
          if (!fs.statSync(productPath).isDirectory()) continue;

          const result = await seedProduct({
            productPath,
            productDir,
            categoryRecord,
            brandRecord,
            catFolderName,
            brandName,
          });
          if (result) {
            productCount++;
            imageCount += result.imageCount;
          } else {
            skipped++;
          }
        }
      } else {
        
        const result = await seedProduct({
          productPath: bopPath,
          productDir: brandOrProductDir,
          categoryRecord,
          brandRecord: null,
          catFolderName,
          brandName: null,
        });
        if (result) {
          productCount++;
          imageCount += result.imageCount;
        } else {
          skipped++;
        }
      }
    }
  }

  console.log(`\n✅ Seed complete!`);
  console.log(`   Products seeded : ${productCount}`);
  console.log(`   Images copied   : ${imageCount}`);
  console.log(`   Skipped         : ${skipped}`);
}


async function seedProduct({ productPath, productDir, categoryRecord, brandRecord, catFolderName, brandName }) {
  const detailsFile = path.join(productPath, 'detials.txt');

  
  const details = parseDetails(detailsFile);
  const productName = (details?.name && details.name.length > 0)
    ? details.name
    : productDir; 

  if (!productName || productName.trim() === '') {
    console.log(`  ⚠ Skipping (no name): ${productPath}`);
    return null;
  }

  const price       = details?.price || 0;
  const description = details?.description || '';

  
  const catSlug   = slugify(catFolderName.replace(/\([\d-]+\)/g, '').trim());
  const brandSlug = brandName ? slugify(brandName) : 'unknown';
  const prodSlug  = slugify(productDir);
  const destDir   = path.join(PRODUCTS_PUBLIC, catSlug, brandSlug, prodSlug);

  
  const imageFiles = getImages(productPath);
  const imageUrls  = [];

  for (const imgFile of imageFiles) {
    const src  = path.join(productPath, imgFile);
    const dest = path.join(destDir, imgFile);
    copyFile(src, dest);
    imageUrls.push(`/uploads/products/${catSlug}/${brandSlug}/${prodSlug}/${imgFile}`);
  }

  const primaryImageUrl = imageUrls[0] || null;

  
  let product;
  try {
    const existing = await prisma.product.findFirst({
      where: { name: productName, categoryId: categoryRecord.id },
    });

    if (existing) {
      product = await prisma.product.update({
        where: { id: existing.id },
        data: {
          description,
          price,
          imageUrl: primaryImageUrl,
          brandId: brandRecord?.id || null,
        },
      });
    } else {
      product = await prisma.product.create({
        data: {
          name:        productName,
          description,
          price,
          stock:       10,
          categoryId:  categoryRecord.id,
          brandId:     brandRecord?.id || null,
          imageUrl:    primaryImageUrl,
        },
      });
    }
  } catch (err) {
    console.log(`  ✗ Error seeding "${productName}": ${err.message}`);
    return null;
  }

  
  await prisma.productImage.deleteMany({ where: { productId: product.id } });
  for (let i = 0; i < imageUrls.length; i++) {
    await prisma.productImage.create({
      data: { productId: product.id, imageUrl: imageUrls[i], order: i },
    });
  }

  console.log(`  ✔ [${categoryRecord.name}] ${productName} — ${imageUrls.length} image(s)`);
  return { imageCount: imageUrls.length };
}


main()
  .catch(e => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
