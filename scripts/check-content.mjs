import { readFile, readdir, stat } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Check the published static outputs as a connected site, independently of rendering.
const root = fileURLToPath(new URL("../", import.meta.url));
const origin = "https://sshift.xyz";
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };
const decode = (value) => value.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const sources = (await readdir(resolve(root, "content/articles"))).filter((file) => file.endsWith(".md") && file !== "README.md");
const files = ["index.html", "articles/index.html"];
const titles = new Set();
const descriptions = new Set();
const articleUrls = [];
const sizes = [];
for (const sourceFile of sources) {
  const text = await readFile(resolve(root, "content/articles", sourceFile), "utf8");
  const front = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  assert(front, `${sourceFile}: missing front matter`);
  if (!front) continue;
  const meta = Object.fromEntries([...front[1].matchAll(/^([\w-]+):\s*"(.*)"\s*$/gm)].map((match) => [match[1], match[2]]));
  const body = text.slice(front[0].length);
  const wordCount = body.trim().split(/\s+/).length;
  sizes.push({ slug: meta.slug, words: wordCount });
  assert(wordCount >= 450, `${sourceFile}: too little material for a substantive guide (${wordCount} words)`);
  assert(!titles.has(meta.title), `${sourceFile}: duplicate title`);
  assert(!descriptions.has(meta.description), `${sourceFile}: duplicate description`);
  assert(meta.description?.length >= 80 && meta.description.length <= 200, `${sourceFile}: description outside useful bounds`);
  assert((body.match(/^## /gm) || []).length >= 3, `${sourceFile}: missing useful sections`);
  assert(!/^\s*\|.*\|\s*$/m.test(body), `${sourceFile}: unsupported Markdown table`);
  assert(!/^(?: {2,}|\t)[*-] /m.test(body), `${sourceFile}: unsupported nested Markdown list`);
  titles.add(meta.title); descriptions.add(meta.description);
  const file = `articles/${meta.slug}/index.html`;
  files.push(file);
  const canonical = `${origin}/articles/${meta.slug}/`;
  articleUrls.push(canonical);
  let html;
  try { html = await readFile(resolve(root, file), "utf8"); }
  catch { failures.push(`${sourceFile}: no generated page`); continue; }
  assert(html.includes(`<link rel="canonical" href="${canonical}">`), `${file}: canonical mismatch`);
  assert(decode(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1] || "") === meta.title, `${file}: headline does not match source`);
  assert((html.match(/<h1\b/g) || []).length === 1, `${file}: expected one H1`);
  assert(!/\[[^\]]+\]\((?:https?:|\.\.?\/|\/|#)/.test(html), `${file}: unrendered Markdown link`);
  assert(html.includes('aria-label="In this guide"'), `${file}: missing contents navigation`);
  assert(html.includes('rel="author"'), `${file}: missing author link`);
  const service = meta.service === "software" || ["applied-ai-cheltenham", "ai-agents-cheltenham-businesses", "bespoke-software-cost-cheltenham", "when-spreadsheets-hold-you-back"].includes(meta.slug) ? "custom-software-cheltenham" : "web-design-cheltenham";
  assert(html.includes(`href="../../services/${service}/"`), `${file}: missing appropriate service route`);
  assert(html.includes('href="../../#contact"'), `${file}: missing enquiry route`);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap((match) => {
    try { const value = JSON.parse(match[1]); return value["@graph"] || [value]; }
    catch { failures.push(`${file}: invalid structured data`); return []; }
  });
  assert(schemas.some((item) => item["@type"] === "Article" && item.mainEntityOfPage === canonical), `${file}: missing matching Article schema`);
  assert(schemas.some((item) => item["@type"] === "BreadcrumbList" && item.itemListElement?.length === 3), `${file}: missing breadcrumb schema`);
  try { await stat(resolve(root, "dist", file)); }
  catch { failures.push(`${file}: not included in production build; run npm run build`); }
}
for (const entry of await readdir(resolve(root, "services"), { withFileTypes: true })) {
  if (entry.isDirectory()) files.push(`services/${entry.name}/index.html`);
}
const pageCache = new Map();
const getPage = async (file) => {
  if (!pageCache.has(file)) pageCache.set(file, await readFile(resolve(root, file), "utf8"));
  return pageCache.get(file);
};
let checkedLinks = 0;
for (const file of files) {
  let html;
  try { html = await getPage(file); } catch { continue; }
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert(new Set(ids).size === ids.length, `${file}: duplicate anchor IDs`);
  assert(!/<meta\s+[^>]*name="robots"[^>]*content="[^"]*noindex/.test(html), `${file}: unexpectedly excluded from indexing`);
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const href = decode(match[1]);
    const url = new URL(href, `${origin}/${file}`);
    if (url.origin !== origin) continue;
    checkedLinks++;
    const path = decodeURIComponent(url.pathname);
    let target = path.endsWith("/") ? `${path}index.html` : path;
    try {
      const info = await stat(resolve(root, "." + target));
      if (info.isDirectory()) {
        target += "/index.html";
        assert((await stat(resolve(root, "." + target))).isFile(), `${file}: missing directory index ${href}`);
      }
      if (url.hash) {
        const targetHtml = await getPage(target.slice(1));
        const anchor = decodeURIComponent(url.hash.slice(1));
        assert([...targetHtml.matchAll(/\bid="([^"]+)"/g)].some((item) => item[1] === anchor), `${file}: broken anchor ${href}`);
      }
    } catch { failures.push(`${file}: broken internal link ${href}`); }
  }
}
const index = await getPage("articles/index.html");
const sitemap = await readFile(resolve(root, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => decode(match[1]));
assert(sitemap.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'), "Sitemap namespace invalid");
assert(new Set(sitemapUrls).size === sitemapUrls.length, "Duplicate sitemap entries");
const expectedUrls = [origin + "/", origin + "/articles/", ...files.filter((file) => file.startsWith("services/")).map((file) => origin + "/" + file.replace(/index.html$/, "")), ...articleUrls];
assert(expectedUrls.length === sitemapUrls.length && expectedUrls.every((url) => sitemapUrls.includes(url)), "Sitemap does not match the page inventory");
for (const url of articleUrls) {
  const slug = url.split("/").filter(Boolean).at(-1);
  assert(index.includes(`href="./${slug}/"`), `${slug}: missing crawlable guide-index link`);
}
assert(index.includes('"@type":"ItemList"'), "Guide hub is missing its article listing schema");
const articleDirectories = (await readdir(resolve(root, "articles"), { withFileTypes: true })).filter((entry) => entry.isDirectory()).map((entry) => entry.name);
assert(articleDirectories.length === sources.length && articleDirectories.every((slug) => sources.includes(slug + ".md")), "Generated article inventory contains stale or missing pages");
if (failures.length) {
  console.error(failures.join("\n")); process.exitCode = 1;
} else {
  console.log(`Validated ${sources.length} articles, ${files.length} HTML pages, ${sitemapUrls.length} sitemap URLs and ${checkedLinks} internal links/anchors.`);
  console.log(`Article words: ${sizes.reduce((total, item) => total + item.words, 0)} total; ${Math.min(...sizes.map((item) => item.words))}–${Math.max(...sizes.map((item) => item.words))} per guide.`);
}
