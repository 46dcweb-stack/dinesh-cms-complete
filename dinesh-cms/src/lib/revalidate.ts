// Ask the server to drop the ISR cache for pages a CMS edit affects, so the
// change is live immediately instead of after the revalidate window.
// Never throws: a failed revalidation must not make a successful save look
// like it failed — the page still updates on its own within ~2 minutes.
import { auth } from "./firebase";

export async function revalidate(opts: { paths?: string[]; tags?: string[] }): Promise<boolean> {
  try {
    const user = auth.currentUser;
    if (!user) return false;
    const token = await user.getIdToken();
    const res = await fetch("/api/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ paths: opts.paths ?? [], tags: opts.tags ?? [] }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
