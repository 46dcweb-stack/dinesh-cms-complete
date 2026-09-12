// ─────────────────────────────────────────────────────────────────────────────
// Tidies a blob of HTML into readable, indented source for the CMS editors.
// Purely cosmetic: HTML collapses whitespace between block tags, so the
// rendered page is byte-for-byte unchanged.
// ─────────────────────────────────────────────────────────────────────────────

const BLOCK = ["h1", "h2", "h3", "h4", "p", "ul", "ol", "blockquote", "hr", "div", "section", "table", "tr"];

export function formatHtml(input: string): string {
  if (!input) return "";
  // Only touch content that is actually HTML — leave plain text alone.
  if (!input.trimStart().startsWith("<")) return input;

  let s = input.replace(/\s*\n\s*/g, " ").replace(/\s{2,}/g, " ").trim();

  for (const t of BLOCK) {
    s = s.replace(new RegExp(`\\s*<${t}(\\s|>)`, "g"), `\n<${t}$1`);
    s = s.replace(new RegExp(`</${t}>\\s*`, "g"), `</${t}>\n`);
  }
  s = s.replace(/\s*<li(\s|>)/g, "\n<li$1").replace(/<\/li>\s*/g, "</li>\n");

  const out: string[] = [];
  let indent = 0;
  for (const raw of s.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    if (/^<\/(ul|ol)>/.test(line)) indent = Math.max(0, indent - 1);
    out.push("  ".repeat(indent) + line);
    if (/^<(ul|ol)(\s|>)/.test(line) && !/<\/(ul|ol)>/.test(line)) indent += 1;
  }

  // Blank line before each top-level section so the document is scannable
  return out.join("\n").replace(/\n(<h2)/g, "\n\n$1").trim();
}
