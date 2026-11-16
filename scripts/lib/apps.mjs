import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { markdownHeadings } from "./markdown.mjs";

export const APP_ORIGIN = "https://sshift.xyz";
export const documentNames = { privacy: "Privacy policy", terms: "Terms of use" };
const defaultContentDir = fileURLToPath(new URL("../../content/apps/", import.meta.url));

export function appUrl(slug, document) {
  return `${APP_ORIGIN}/apps/${slug}/${document}/`;
}

export async function loadApps(contentDir = defaultContentDir) {
  const entries = await readdir(contentDir, { withFileTypes: true });
  const slugs = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
  return Promise.all(slugs.map(async (slug) => {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      throw new Error(`Invalid app slug: ${slug}`);
    }
    const directory = join(contentDir, slug);
    const meta = JSON.parse(await readFile(join(directory, "app.json"), "utf8"));
    for (const field of ["name", "description", "supportEmail"]) {
      if (typeof meta[field] !== "string" || !meta[field].trim()) {
        throw new Error(`${slug}/app.json needs a ${field} string`);
      }
    }
    if (meta.updated !== null) {
      const date = new Date(meta.updated);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.updated) || Number.isNaN(date.getTime()) ||
          date.toISOString().slice(0, 10) !== meta.updated) {
        throw new Error(`${slug}/app.json needs a valid YYYY-MM-DD updated date or null for a draft`);
      }
    }
    if (!/^[a-z0-9._+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(meta.supportEmail)) {
      throw new Error(`${slug}/app.json needs a valid supportEmail`);
    }

    const documents = {};
    for (const document of Object.keys(documentNames)) {
      const body = await readFile(join(directory, `${document}.md`), "utf8");
      if (markdownHeadings(body).length === 0) {
        throw new Error(`${slug}/${document}.md needs at least one section heading (##)`);
      }
      documents[document] = body;
    }
    const { name, description, updated, supportEmail } = meta;
    return { slug, name, description, updated, supportEmail, documents };
  }));
}
