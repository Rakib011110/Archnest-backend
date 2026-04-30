# MedEx Medicine Seed Data (MongoDB)

This folder contains MongoDB Extended JSON seed files for medicine e-commerce.

Included datasets:
- `categories.json` (8 categories)
- `brands.json`
- `dosage_forms.json`
- `generics.json`
- `products.json` (24 medicine products with image URLs)
- `banners.json`
- `flash_sales.json`
- `settings.json`

## Quick Seed (Generics + Dosage Forms Only)

If you only need base medicine metadata for admin create/edit pages, run:

```powershell
npm run seed:generic-dosage
```

This command uses `DB_URL` from `.env` and upserts by `name` so it can be run multiple times safely.

## Import Order

Import in this exact order so references resolve correctly:

1. categories
2. brands
3. dosage forms
4. generics
5. products
6. banners
7. flash sales
8. settings

## mongoimport Commands

Use your database name instead of `medex` if different.

```powershell
mongoimport --uri "mongodb://127.0.0.1:27017/medex" --collection categories --file "seed-data/medicine/categories.json" --jsonArray --drop
mongoimport --uri "mongodb://127.0.0.1:27017/medex" --collection brands --file "seed-data/medicine/brands.json" --jsonArray --drop
mongoimport --uri "mongodb://127.0.0.1:27017/medex" --collection dosageforms --file "seed-data/medicine/dosage_forms.json" --jsonArray --drop
mongoimport --uri "mongodb://127.0.0.1:27017/medex" --collection generics --file "seed-data/medicine/generics.json" --jsonArray --drop
mongoimport --uri "mongodb://127.0.0.1:27017/medex" --collection products --file "seed-data/medicine/products.json" --jsonArray --drop
mongoimport --uri "mongodb://127.0.0.1:27017/medex" --collection banners --file "seed-data/medicine/banners.json" --jsonArray --drop
mongoimport --uri "mongodb://127.0.0.1:27017/medex" --collection flashsales --file "seed-data/medicine/flash_sales.json" --jsonArray --drop
mongoimport --uri "mongodb://127.0.0.1:27017/medex" --collection settings --file "seed-data/medicine/settings.json" --jsonArray --drop
```

## Notes

- Product/category/brand slugs and product SKUs are prefilled because `mongoimport` bypasses Mongoose pre-save hooks.
- IDs are fixed for deterministic references across files.
- `image`, `thumbnail`, `gallery`, `logo`, and `banner` use medicine/healthcare URL images.
