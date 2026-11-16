import { mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { APP_ORIGIN, appUrl, documentNames, loadApps } from "./lib/apps.mjs";
import { escapeHtml, markdownHeadings, renderMarkdown } from "./lib/markdown.mjs";

const defaultOutputDir = fileURLToPath(new URL("../apps/", import.meta.url));
const formatDate = new Intl.DateTimeFormat("en-GB", { dateStyle: "long", timeZone: "UTC" });

function page({ title, description, canonical, root, directory, draft, body }) {
  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#111315">
  <meta name="description" content="${escapeHtml(description)}">${draft ? '\n  <meta name="robots" content="noindex">' : ""}
  <link rel="canonical" href="${canonical}">
  <link rel="icon" href="${root}assets/favicon.ico">
  <link rel="stylesheet" href="${root}styles.css">
  <link rel="stylesheet" href="${root}articles.css">
  <link rel="stylesheet" href="${root}app-policies.css">
  <title>${escapeHtml(title)} | Singularity Shift</title>
</head>
<body class="app-policies">
  <a class="skip-link" href="#main-content">Skip to main content</a>
  <header class="policy-header">
    <div class="shell">
      <a class="brand" href="${root}" aria-label="Singularity Shift Ltd home">
        <img src="${root}assets/singularity-shift-mark.png" alt="" width="46" height="46">
        <span>Singularity Shift <small>Ltd</small></span>
      </a>${directory ? `\n      <a href="${directory}">All app policies</a>` : ""}
    </div>
  </header>
${body}
  <footer class="policy-footer">
    <div class="shell">
      <p>Singularity Shift Ltd · Company no. 16311259 · Cheltenham, UK</p>
      <a href="https://inferenco.com">Inferenco partnership</a>
    </div>
  </footer>
</body>
</html>
`;
}

function renderDirectory(apps) {
  const items = apps.map(({ slug, name, description, updated }) => `
      <li>
        <h2>${escapeHtml(name)}</h2>
        <p>${escapeHtml(description)}</p>${updated === null ? '\n        <p class="policy-draft">Draft policies for review</p>' : ""}
        <ul class="policy-links">${Object.entries(documentNames).map(([key, label]) =>
          `<li><a href="./${slug}/${key}/" aria-label="${escapeHtml(`${label} for ${name}`)}">${label}</a></li>`).join("")}</ul>
      </li>`).join("");

  return page({
    title: "App policies",
    description: "Privacy policies and terms of use for apps by Singularity Shift Ltd.",
    canonical: `${APP_ORIGIN}/apps/`,
    root: "../",
    body: `  <main id="main-content" class="policy-shell">
    <h1>App policies</h1>
    <ul class="policy-directory">${items}
    </ul>
  </main>`,
  });
}

function renderDocument(app, document) {
  const { slug, name, updated, supportEmail, documents } = app;
  const body = documents[document];
  const label = documentNames[document];
  const other = document === "privacy" ? "terms" : "privacy";
  const headings = markdownHeadings(body).map(({ title, id }) =>
    `<li><a href="#${id}">${escapeHtml(title)}</a></li>`).join("");
  const draft = updated === null;
  const status = draft
    ? '<p class="policy-draft"><strong>Draft for review.</strong> This document is not yet effective.</p>'
    : `<p class="policy-date">Last updated <time datetime="${updated}">${formatDate.format(new Date(updated))}</time></p>`;
  return page({
    title: `${label} for ${name}`,
    description: `Read the ${label.toLowerCase()} for ${name} by Singularity Shift Ltd.`,
    canonical: appUrl(slug, document),
    root: "../../../",
    directory: "../../",
    draft,
    body: `  <main id="main-content" class="policy-shell">
    <p class="policy-app-name">${escapeHtml(name)}</p>
    <h1>${label}</h1>
    ${status}
    <ul class="policy-links">
      <li><a href="../${other}/">${documentNames[other]}</a></li>
      <li><a href="mailto:${escapeHtml(supportEmail)}">Contact support</a></li>
    </ul>
    <nav class="policy-contents" aria-label="On this page">
      <p>On this page</p>
      <ol>${headings}</ol>
    </nav>
    <article class="article-prose" aria-label="${label}">
${renderMarkdown(body)}
    </article>
  </main>`,
  });
}

export async function generateApps({ contentDir, outputDir = defaultOutputDir } = {}) {
  const apps = await loadApps(contentDir);
  await mkdir(outputDir, { recursive: true });
  await writeFile(join(outputDir, "index.html"), renderDirectory(apps), "utf8");
  for (const app of apps) {
    for (const document of Object.keys(documentNames)) {
      const directory = join(outputDir, app.slug, document);
      await mkdir(directory, { recursive: true });
      await writeFile(join(directory, "index.html"), renderDocument(app, document), "utf8");
    }
  }
  return apps;
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  await generateApps();
}
