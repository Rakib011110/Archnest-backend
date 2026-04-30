/**
 * Cleanup migration: remove legacy medical-like custom attributes from templates and products.
 *
 * Dry run (default):
 *   node scripts/cleanup-medical-like-custom-attributes.js
 *
 * Apply changes:
 *   node scripts/cleanup-medical-like-custom-attributes.js --apply
 */

const mongoose = require('mongoose');
require('dotenv').config();

const normalizeKey = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');

const compactKey = (value) => normalizeKey(value).replace(/[^a-z0-9]/g, '');

const MEDICAL_ATTRIBUTE_ALIASES = [
  'indication',
  'indications',
  'side effect',
  'side effects',
  'pharmacology',
  'dosage',
  'dosage and pharmacology',
  'dosage & pharmacology',
  'interaction',
  'interactions',
  'drug interaction',
  'drug interactions',
  'storage',
  'storage condition',
  'storage conditions',
  'administration',
  'administration route',
  'route of administration',
  'dosage and administration',
  'dosage & administration',
  'contraindication',
  'contraindications',
  'precaution',
  'precautions',
  'pregnancy',
  'pregnancy category',
  'pregnancy and lactation',
  'pregnancy & lactation',
  'therapeutic class',
  'active ingredient',
  'active ingredients',
  'overdose',
  'dar number',
].map((item) => normalizeKey(item));

const MEDICAL_ATTRIBUTE_ALIAS_SET = new Set(MEDICAL_ATTRIBUTE_ALIASES);
const MEDICAL_ATTRIBUTE_COMPACT_ALIAS_SET = new Set(
  MEDICAL_ATTRIBUTE_ALIASES.map((item) => compactKey(item)),
);

const isMedicalLikeAttributeName = (name) => {
  const normalized = normalizeKey(name);
  if (!normalized) return false;

  if (MEDICAL_ATTRIBUTE_ALIAS_SET.has(normalized)) {
    return true;
  }

  return MEDICAL_ATTRIBUTE_COMPACT_ALIAS_SET.has(compactKey(normalized));
};

const toIdString = (value) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value.toString) return value.toString();
  return String(value);
};

const resolveCollection = (db, candidates) => {
  return db.listCollections().toArray().then((collections) => {
    const existingNames = new Set(collections.map((item) => item.name));
    const matchedName = candidates.find((name) => existingNames.has(name));
    return matchedName || candidates[0];
  });
};

async function run() {
  const applyChanges = process.argv.includes('--apply');
  const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/caddcore-ecom';

  console.log('Starting cleanup for medical-like custom attributes...');
  console.log(`Mode: ${applyChanges ? 'APPLY' : 'DRY RUN'}`);

  await mongoose.connect(dbUrl);
  const db = mongoose.connection.db;

  const templateCollectionName = await resolveCollection(db, [
    'attributetemplates',
    'attributeTemplates',
    'attribute_templates',
  ]);

  const productCollectionName = await resolveCollection(db, ['products']);

  const templatesCollection = db.collection(templateCollectionName);
  const productsCollection = db.collection(productCollectionName);

  console.log(`Template collection: ${templateCollectionName}`);
  console.log(`Product collection: ${productCollectionName}`);

  const removedTemplateAttributeIds = new Set();

  let templateScanned = 0;
  let templateChanged = 0;
  let templateRemovedAttributes = 0;

  const templates = await templatesCollection
    .find({}, { projection: { _id: 1, name: 1, attributes: 1, version: 1 } })
    .toArray();

  for (const template of templates) {
    templateScanned += 1;
    const attrs = Array.isArray(template.attributes) ? template.attributes : [];

    if (attrs.length === 0) continue;

    const keptAttrs = [];
    const removedAttrs = [];

    for (const attr of attrs) {
      const nameEn = String(attr?.name?.en || '').trim();
      if (isMedicalLikeAttributeName(nameEn)) {
        removedAttrs.push(attr);
        if (attr?._id) {
          removedTemplateAttributeIds.add(toIdString(attr._id));
        }
      } else {
        keptAttrs.push(attr);
      }
    }

    if (removedAttrs.length === 0) continue;

    templateChanged += 1;
    templateRemovedAttributes += removedAttrs.length;

    if (applyChanges) {
      await templatesCollection.updateOne(
        { _id: template._id },
        {
          $set: {
            attributes: keptAttrs,
            version: Math.max(1, Number(template.version || 1)) + 1,
            updatedAt: new Date(),
          },
        },
      );
    }
  }

  let productScanned = 0;
  let productChanged = 0;
  let productRemovedAttributes = 0;

  const productCursor = productsCollection.find(
    {},
    {
      projection: {
        _id: 1,
        customAttributes: 1,
      },
    },
  );

  while (await productCursor.hasNext()) {
    const product = await productCursor.next();
    if (!product) break;

    productScanned += 1;
    const attrs = Array.isArray(product.customAttributes)
      ? product.customAttributes
      : [];

    if (attrs.length === 0) continue;

    const keptAttrs = [];
    let removedCount = 0;

    for (const attr of attrs) {
      const nameEn = String(attr?.name?.en || '').trim();
      const templateAttrId = toIdString(attr?.templateAttributeId);
      const removeByName = isMedicalLikeAttributeName(nameEn);
      const removeByTemplateRef =
        !!templateAttrId && removedTemplateAttributeIds.has(templateAttrId);

      if (removeByName || removeByTemplateRef) {
        removedCount += 1;
      } else {
        keptAttrs.push(attr);
      }
    }

    if (removedCount === 0) continue;

    productChanged += 1;
    productRemovedAttributes += removedCount;

    if (applyChanges) {
      await productsCollection.updateOne(
        { _id: product._id },
        {
          $set: {
            customAttributes: keptAttrs,
            updatedAt: new Date(),
          },
        },
      );
    }
  }

  console.log('--- Summary ---');
  console.log(`Templates scanned: ${templateScanned}`);
  console.log(`Templates changed: ${templateChanged}`);
  console.log(`Template attributes removed: ${templateRemovedAttributes}`);
  console.log(`Products scanned: ${productScanned}`);
  console.log(`Products changed: ${productChanged}`);
  console.log(`Product custom attributes removed: ${productRemovedAttributes}`);

  if (!applyChanges) {
    console.log('Dry run completed. Re-run with --apply to persist changes.');
  } else {
    console.log('Cleanup applied successfully.');
  }
}

run()
  .catch((error) => {
    console.error('Cleanup failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
