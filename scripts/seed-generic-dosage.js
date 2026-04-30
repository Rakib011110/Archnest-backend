/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const dbUrl = process.env.DB_URL;

if (!dbUrl) {
  console.error('DB_URL is missing in .env');
  process.exit(1);
}

const readJsonFile = (filePath) => {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
};

const toObjectId = (value) => {
  if (!value) return undefined;

  if (typeof value === 'object' && value.$oid) {
    return new mongoose.Types.ObjectId(value.$oid);
  }

  if (typeof value === 'string' && mongoose.Types.ObjectId.isValid(value)) {
    return new mongoose.Types.ObjectId(value);
  }

  return undefined;
};

const normalizeText = (value) => String(value || '').trim();

const normalizeIndications = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeText(item)).filter(Boolean);
  }

  const asText = normalizeText(value);
  return asText ? [asText] : [];
};

const seedGenerics = async (generics) => {
  const ops = generics
    .map((doc) => {
      const seedId = toObjectId(doc._id);
      const name = normalizeText(doc.name);
      if (!name) return null;

      const payload = {
        name,
        description: normalizeText(doc.description),
        therapeuticClass: normalizeText(doc.therapeuticClass),
        indications: normalizeIndications(doc.indications),
        pharmacology: normalizeText(doc.pharmacology),
        dosageAdministration: normalizeText(doc.dosageAdministration),
        interaction: normalizeText(doc.interaction),
        contraindications: normalizeText(doc.contraindications),
        sideEffects: normalizeText(doc.sideEffects),
        pregnancyCategory: normalizeText(doc.pregnancyCategory),
        precautions: normalizeText(doc.precautions),
        isActive: doc.isActive !== false,
      };

      const update = { $set: payload };
      if (seedId) {
        update.$setOnInsert = { _id: seedId };
      }

      return {
        updateOne: {
          filter: { name },
          update,
          upsert: true,
        },
      };
    })
    .filter(Boolean);

  if (ops.length === 0) return null;

  return mongoose.connection.collection('generics').bulkWrite(ops, {
    ordered: false,
  });
};

const seedDosageForms = async (dosageForms) => {
  const ops = dosageForms
    .map((doc) => {
      const seedId = toObjectId(doc._id);
      const name = normalizeText(doc.name);
      if (!name) return null;

      const payload = {
        name,
        icon: normalizeText(doc.icon),
        isActive: doc.isActive !== false,
      };

      const update = { $set: payload };
      if (seedId) {
        update.$setOnInsert = { _id: seedId };
      }

      return {
        updateOne: {
          filter: { name },
          update,
          upsert: true,
        },
      };
    })
    .filter(Boolean);

  if (ops.length === 0) return null;

  return mongoose.connection.collection('dosageforms').bulkWrite(ops, {
    ordered: false,
  });
};

const run = async () => {
  const genericsPath = path.join(
    __dirname,
    '..',
    'seed-data',
    'medicine',
    'generics.json',
  );
  const dosageFormsPath = path.join(
    __dirname,
    '..',
    'seed-data',
    'medicine',
    'dosage_forms.json',
  );

  const generics = readJsonFile(genericsPath);
  const dosageForms = readJsonFile(dosageFormsPath);

  await mongoose.connect(dbUrl);
  console.log('Connected to MongoDB');

  try {
    const genericResult = await seedGenerics(generics);
    const dosageResult = await seedDosageForms(dosageForms);

    console.log('Generics seeded:', {
      matched: genericResult?.matchedCount || 0,
      modified: genericResult?.modifiedCount || 0,
      upserted: genericResult?.upsertedCount || 0,
    });

    console.log('Dosage forms seeded:', {
      matched: dosageResult?.matchedCount || 0,
      modified: dosageResult?.modifiedCount || 0,
      upserted: dosageResult?.upsertedCount || 0,
    });
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB connection closed');
  }
};

run().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
