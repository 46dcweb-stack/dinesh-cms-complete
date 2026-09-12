// ─────────────────────────────────────────────────────────────────────────────
// IndexNow — push changed URLs to search engines instead of waiting for a crawl.
//
// Posting to api.indexnow.org fans the submission out to every participating
// engine (Bing, Yandex, Seznam.cz, Naver and others), not just Bing.
//
// The host is derived from SITE_URL rather than hardcoded. IndexNow rejects a
// batch whose URLs do not belong to the declared host, and this site's canonical
// domain carries the www prefix — a bare "46dc.com" host would fail every
// submission with a 422 that is easy to miss.
// ─────────────────────────────────────────────────────────────────────────────
import { SITE_URL } from "./site";

export const INDEXNOW_KEY = "da3624c46e314856b8588dcea34948a8";

const HOST = new URL(SITE_URL).host;                    // www.46dc.com
const KEY_LOCATION = `${SITE_URL}/${INDEXNOW_KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

export interface IndexNowResult {
  ok: boolean;
  status: number;
  submitted: number;
  body?: string;
}

/** Turn a path or absolute URL into an absolute URL on the canonical host. */
export function toAbsolute(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}

/**
 * Submit URLs to IndexNow. Only URLs on the canonical host are sent — anything
 * else would make the whole batch fail, so foreign URLs are dropped rather than
 * allowed to take the valid ones down with them.
 */
export async function submitUrlsToIndexNow(input: string[]): Promise<IndexNowResult> {
  const urlList = Array.from(new Set(input.map(toAbsolute)))
    .filter(u => { try { return new URL(u).host === HOST; } catch { return false; } });

  if (!urlList.length) return { ok: true, status: 200, submitted: 0 };

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host: HOST, key: INDEXNOW_KEY, keyLocation: KEY_LOCATION, urlList }),
    });
    return {
      ok: res.ok,
      status: res.status,
      submitted: urlList.length,
      body: res.ok ? undefined : await res.text().catch(() => undefined),
    };
  } catch (err: any) {
    return { ok: false, status: 0, submitted: urlList.length, body: err?.message };
  }
}

export async function submitUrlToIndexNow(url: string): Promise<IndexNowResult> {
  return submitUrlsToIndexNow([url]);
}
