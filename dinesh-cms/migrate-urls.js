/**
 * migrate-urls.js
 * Updates all Firestore document fields that contain the old storage bucket URL
 * to point to the new EU storage bucket.
 *
 * Run: node migrate-urls.js
 */

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const path = require("path");

// ── CONFIG ────────────────────────────────────────────────────────────────────
const SERVICE_ACCOUNT_PATH = "./service-account-eu.json"; // put your EU service account JSON here
const OLD_BUCKET = "dineshportfolio-c476c.firebasestorage.app";
const NEW_BUCKET = "dineshportfolio-eu.firebasestorage.app";

// All collections that may contain image URLs
const COLLECTIONS = [
  "blogPosts",
  "galleryImages",
  "pressMentions",
  "ventures",
  "teamMembers",
  "homePage",
  "aboutPage",
  "siteSettings",
  "faqItems",
  "mediaLibrary",
];
// ─────────────────────────────────────────────────────────────────────────────

const serviceAccount = require(path.resolve(SERVICE_ACCOUNT_PATH));

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

function replaceUrls(value) {
  if (typeof value === "string") {
    return value.replaceAll(OLD_BUCKET, NEW_BUCKET);
  }
  if (Array.isArray(value)) {
    return value.map(replaceUrls);
  }
  if (value && typeof value === "object") {
    const updated = {};
    for (const [k, v] of Object.entries(value)) {
      updated[k] = replaceUrls(v);
    }
    return updated;
  }
  return value;
}

async function migrateCollection(collectionName) {
  const snapshot = await db.collection(collectionName).get();
  if (snapshot.empty) {
    console.log(`  [${collectionName}] empty — skipping`);
    return;
  }

  let updated = 0;
  const batch = db.batch();

  snapshot.forEach((doc) => {
    const data = doc.data();
    const newData = replaceUrls(data);
    const changed = JSON.stringify(data) !== JSON.stringify(newData);
    if (changed) {
      batch.update(doc.ref, newData);
      updated++;
    }
  });

  if (updated > 0) {
    await batch.commit();
    console.log(`  [${collectionName}] updated ${updated} document(s)`);
  } else {
    console.log(`  [${collectionName}] no changes needed`);
  }
}

async function main() {
  console.log(`\nMigrating URLs from:\n  ${OLD_BUCKET}\nto:\n  ${NEW_BUCKET}\n`);
  for (const col of COLLECTIONS) {
    await migrateCollection(col);
  }
  console.log("\nDone!");
}

main().catch(console.error);
