// Submit every URL in the live sitemap to IndexNow, in one batch.
//
// Use it after a first deploy to push the whole site at once, or any time a
// resubmission is wanted. Day to day this is not needed: every CMS save already
// submits the pages it changed through /api/revalidate.
//
//   node scripts/submit-sitemap-to-indexnow.mjs
//
// Node 18+ (built-in fetch). No dependencies.

// Must match src/lib/site.ts. The www prefix matters: IndexNow rejects a batch
// whose URLs do not belong to the declared host.
const SITE_URL = process.env.SITE_URL || "https://www.46dc.com";
const INDEXNOW_KEY = "da3624c46e314856b8588dcea34948a8";

const HOST = new URL(SITE_URL).host;
const KEY_LOCATION = `${SITE_URL}/${INDEXNOW_KEY}.txt`;
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

async function main() {
  // Fail loudly if the key file is not reachable — without it every submission
  // is rejected, and the rejection is easy to mistake for a transient error.
  const keyRes = await fetch(KEY_LOCATION);
  const keyBody = keyRes.ok ? (await keyRes.text()).trim() : "";
  if (keyBody !== INDEXNOW_KEY) {
    throw new Error(
      `Key file check failed at ${KEY_LOCATION} (HTTP ${keyRes.status}). ` +
      `It must return exactly "${INDEXNOW_KEY}".`
    );
  }
  console.log(`Key file verified at ${KEY_LOCATION}`);

  const res = await fetch(SITEMAP_URL);
  if (!res.ok) throw new Error(`Could not fetch ${SITEMAP_URL}: HTTP ${res.status}`);
  const xml = await res.text();

  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)]
    .map(m => m[1].trim())
    .filter(u => { try { return new URL(u).host === HOST; } catch { return false; } });

  if (!urls.length) {
    console.log("No URLs found in sitemap.xml — nothing to submit.");
    return;
  }

  console.log(`Submitting ${urls.length} URL(s) to IndexNow as ${HOST}...`);
  const submit = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: HOST, key: INDEXNOW_KEY, keyLocation: KEY_LOCATION, urlList: urls }),
  });

  if (submit.ok) {
    console.log(`Accepted (HTTP ${submit.status}).`);
  } else {
    console.error(`Rejected (HTTP ${submit.status}): ${await submit.text().catch(() => "")}`);
    process.exitCode = 1;
  }
}

main().catch(err => { console.error(err.message ?? err); process.exitCode = 1; });
