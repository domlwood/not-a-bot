import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { AppModule } from '../app.module.js';
import { Product } from '../products/product.entity.js';
import { Variant } from '../variants/variant.entity.js';

// Nike's recent limited/special-edition drop - hyped, low stock, gone in seconds.
const PRODUCT_NAME = "Nike Air Jordan 1 Retro High OG 'Lost & Found' (Special Edition)";

// Every size sold out instantly, so remaining stock is always 0.
const SIZE_VARIANTS: { label: string; total: number }[] = [
  { label: 'US 8', total: 3000 },
  { label: 'US 8.5', total: 4000 },
  { label: 'US 9', total: 5000 },
  { label: 'US 9.5', total: 5000 },
  { label: 'US 10', total: 6000 },
  { label: 'US 10.5', total: 5000 },
  { label: 'US 11', total: 4000 },
  { label: 'US 12', total: 2500 },
];

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['warn', 'error'],
  });

  const products: Repository<Product> = app.get(getRepositoryToken(Product));
  const variants: Repository<Variant> = app.get(getRepositoryToken(Variant));

  let product = await products.findOne({ where: { name: PRODUCT_NAME } });
  if (!product) {
    product = await products.save(products.create({ name: PRODUCT_NAME }));
    console.log(`Created product: ${product.name}`);
  } else {
    console.log(`Product already exists: ${product.name}`);
  }

  for (const size of SIZE_VARIANTS) {
    const existing = await variants.findOne({
      where: { label: size.label, Product: { id: product.id } },
      relations: { Product: true },
    });

    if (existing) {
      console.log(`Variant already exists: ${size.label}`);
      continue;
    }

    await variants.save(
      variants.create({
        Product: product,
        label: size.label,
        total: size.total,
        remaining: 0, // sold out in seconds
      }),
    );
    console.log(`Created variant: ${size.label} (${size.total} total, sold out)`);
  }

  await app.close();
}

seed()
  .then(() => {
    console.log('Seeding complete.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
  });
