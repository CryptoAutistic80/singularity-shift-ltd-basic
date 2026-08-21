import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL("../", import.meta.url));
const contentDir = resolve(rootDir, "content", "articles");
const outputDir = resolve(rootDir, "articles");

const articleOrder = [
  "ai-agents-cheltenham-businesses.md",
  "applied-ai-cheltenham.md",
  "web-development-cheltenham.md",
  "bespoke-software-cost-cheltenham.md",
  "when-spreadsheets-hold-you-back.md",
];

const articlePresentation = {
  "ai-agents-cheltenham-businesses": {
    topic: "Applied AI · Systems design",
    label: "AI agents",
  },
  "applied-ai-cheltenham": {
    topic: "Applied AI · Practical adoption",
    label: "Applied AI",
  },
  "web-development-cheltenham": {
    topic: "Web development · Product decisions",
    label: "Web development",
  },
  "bespoke-software-cost-cheltenham": {
    topic: "Bespoke software · Scoping",
    label: "Bespoke software",
  },
  "when-spreadsheets-hold-you-back": {
    topic: "Operations · Process improvement",
    label: "Operations",
  },
};

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const renderInline = (value) =>
  escapeHtml(value)
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      (_, label, href) =>
        '<a href="' + href + '" target="_blank" rel="noopener noreferrer">' + label + "</a>",
    )
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\x60([^\x60]+)\x60/g, "<code>$1</code>");

function parseFrontMatter(source, filename) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);

  if (!match) {
    throw new Error("Missing front matter in " + filename);
  }

  const meta = {};

  for (const line of match[1].split(/\r?\n/)) {
    const entry = line.match(/^([a-zA-Z][\w-]*):\s*"(.*)"\s*$/);

    if (entry) {
      meta[entry[1]] = entry[2];
    }
  }

  for (const key of ["title", "description", "slug", "audience"]) {
    if (!meta[key]) {
      throw new Error("Missing " + key + " in " + filename);
    }
  }

  return {
    meta,
    body: source.slice(match[0].length).trim(),
  };
}

function renderMarkdown(markdown) {
  const lines = markdown.split(/\r?\n/);
  const blocks = [];
  let index = 0;
  const startsBlock = (line) =>
    /^#{1,3} /.test(line) ||
    /^[-*] /.test(line) ||
    /^\d+\. /.test(line) ||
    /^> /.test(line);

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (line.startsWith("# ")) {
      index += 1;
      continue;
    }

    if (line.startsWith("## ")) {
      blocks.push("<h2>" + renderInline(line.slice(3)) + "</h2>");
      index += 1;
      continue;
    }

    if (line.startsWith("### ")) {
      blocks.push("<h3>" + renderInline(line.slice(4)) + "</h3>");
      index += 1;
      continue;
    }

    if (line.startsWith("> ")) {
      const quote = [];

      while (index < lines.length && lines[index].startsWith("> ")) {
        quote.push(lines[index].slice(2));
        index += 1;
      }

      blocks.push("<blockquote>" + renderInline(quote.join(" ")) + "</blockquote>");
      continue;
    }

    const ordered = /^\d+\. /.test(line);
    const listPattern = ordered ? /^\d+\. (.+)$/ : /^[-*] (.+)$/;

    if (listPattern.test(line)) {
      const items = [];

      while (index < lines.length) {
        const item = lines[index].match(listPattern);

        if (!item) {
          break;
        }

        items.push("<li>" + renderInline(item[1]) + "</li>");
        index += 1;
      }

      blocks.push((ordered ? "<ol>" : "<ul>") + items.join("") + (ordered ? "</ol>" : "</ul>"));
      continue;
    }

    const paragraph = [];

    while (index < lines.length && lines[index].trim() && !startsBlock(lines[index])) {
      paragraph.push(lines[index].trim());
      index += 1;
    }

    if (paragraph.length) {
      blocks.push("<p>" + renderInline(paragraph.join(" ")) + "</p>");
    }
  }

  return blocks.join("\n");
}

function safeJson(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function pageHead({ title, description, canonicalUrl, stylesHref, schema }) {
  const pageTitle = title + " | Singularity Shift";
  const escapedTitle = escapeHtml(pageTitle);
  const escapedDescription = escapeHtml(description);

  return [
    "<!DOCTYPE html>",
    '<html lang="en-GB">',
    "<head>",
    '  <meta charset="UTF-8">',
    '  <meta name="viewport" content="width=device-width, initial-scale=1">',
    '  <meta name="theme-color" content="#111315">',
    '  <meta name="description" content="' + escapedDescription + '">',
    '  <meta property="og:title" content="' + escapedTitle + '">',
    '  <meta property="og:description" content="' + escapedDescription + '">',
    '  <meta property="og:type" content="article">',
    '  <meta property="og:url" content="' + canonicalUrl + '">',
    '  <meta property="og:image" content="https://sshift.xyz/assets/social-preview.jpg">',
    '  <meta property="og:image:alt" content="Singularity Shift Ltd — applied AI and dependable software">',
    '  <meta name="twitter:card" content="summary_large_image">',
    '  <meta name="twitter:title" content="' + escapedTitle + '">',
    '  <meta name="twitter:description" content="' + escapedDescription + '">',
    '  <meta name="twitter:image" content="https://sshift.xyz/assets/social-preview.jpg">',
    '  <link rel="canonical" href="' + canonicalUrl + '">',
    '  <link rel="icon" type="image/x-icon" href="' + stylesHref + 'assets/favicon.ico">',
    '  <link rel="preconnect" href="https://fonts.googleapis.com">',
    '  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    '  <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet">',
    '  <link rel="stylesheet" href="' + stylesHref + 'styles.css">',
    '  <link rel="stylesheet" href="' + stylesHref + 'articles.css">',
    "  <title>" + escapedTitle + "</title>",
    '  <script type="application/ld+json">' + safeJson(schema) + "</script>",
    "</head>",
  ].join("\n");
}

function siteHeader({ assetPrefix, rootHref, articlesHref, ctaHref, articleIndex }) {
  const current = articleIndex ? ' aria-current="page"' : "";

  return [
    '<a class="skip-link" href="#main-content">Skip to main content</a>',
    '<header class="site-header article-site-header" data-header>',
    '  <div class="nav-shell">',
    '    <a class="brand" href="' + rootHref + '" aria-label="Singularity Shift Ltd home">',
    '      <img src="' + assetPrefix + 'assets/singularity-shift-mark.png" alt="" width="54" height="54">',
    "      <span>Singularity Shift <small>Ltd</small></span>",
    "    </a>",
    '    <nav class="site-nav" id="site-nav" data-site-nav aria-label="Primary navigation">',
    '      <a href="' + rootHref + '">Home</a>',
    '      <a href="' + articlesHref + '"' + current + ">Articles</a>",
    "    </nav>",
    '    <div class="nav-actions">',
    '      <button class="menu-toggle button button-small button-ghost" type="button" data-menu-toggle aria-controls="site-nav" aria-expanded="false">',
    '        <span data-menu-label>Menu</span>',
    "      </button>",
    '      <a class="button button-small button-accent" href="' + ctaHref + '">Start a project</a>',
    "    </div>",
    "  </div>",
    "</header>",
  ].join("\n");
}

function siteFooter({ assetPrefix, rootHref }) {
  return [
    '<footer class="site-footer">',
    '  <div class="shell footer-grid">',
    '    <a class="brand brand-footer" href="' + rootHref + '" aria-label="Singularity Shift Ltd home">',
    '      <img src="' + assetPrefix + 'assets/singularity-shift-mark.png" alt="" width="46" height="46" loading="lazy">',
    "      <span>Singularity Shift <small>Ltd</small></span>",
    "    </a>",
    '    <p>© <span data-year>2026</span> Singularity Shift Ltd · Cheltenham, UK</p>',
    '    <a href="https://inferenco.com" target="_blank" rel="noopener noreferrer">Inferenco partnership</a>',
    "  </div>",
    "</footer>",
  ].join("\n");
}

function cardMarkup(article, position) {
  const presentation = articlePresentation[article.slug];
  const number = String(position + 1).padStart(2, "0");

  return [
    '<a class="article-card" href="./' + article.slug + '/">',
    '  <span class="article-card__topline">',
    '    <span class="article-card__number">' + number + "</span>",
    '    <span class="article-card__topic">' + escapeHtml(presentation.topic) + "</span>",
    "  </span>",
    "  <h3>" + escapeHtml(article.title) + "</h3>",
    "  <p>" + escapeHtml(article.description) + "</p>",
    '  <span class="article-card__read">Read article</span>',
    "</a>",
  ].join("\n");
}

function articleSchema(article) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    mainEntityOfPage: article.canonicalUrl,
    author: {
      "@type": "Person",
      name: "James Walford",
    },
    publisher: {
      "@type": "Organization",
      name: "Singularity Shift Ltd",
      url: "https://sshift.xyz/",
    },
    inLanguage: "en-GB",
  };
}

function renderIndex(articles) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Articles | Singularity Shift",
    description: "Practical notes on applied AI, web development and dependable custom software.",
    url: "https://sshift.xyz/articles/",
  };

  return [
    pageHead({
      title: "Articles",
      description: "Practical notes on applied AI, web development and dependable custom software from a founder-led Cheltenham consultancy.",
      canonicalUrl: "https://sshift.xyz/articles/",
      stylesHref: "../",
      schema,
    }),
    '<body class="article-page article-index-page">',
    siteHeader({
      assetPrefix: "../",
      rootHref: "../",
      articlesHref: "./",
      ctaHref: "../#contact",
      articleIndex: true,
    }),
    '<main id="main-content" class="article-main">',
    '  <section class="article-index-hero" aria-labelledby="articles-title">',
    '    <div class="shell article-index-hero__copy">',
    '      <p class="eyebrow">Field notes · AI, software &amp; systems</p>',
    '      <h1 id="articles-title">Notes on building with <em>clarity.</em></h1>',
    '      <p class="article-lede">Practical reading for people deciding what to build, where AI can help, and how to make the resulting system dependable.</p>',
    '      <p class="article-index-hero__note">Written from the work, not for the algorithm</p>',
    "    </div>",
    "  </section>",
    '  <section class="article-index-section" aria-labelledby="reading-title">',
    '    <div class="shell">',
    '      <div class="article-index-heading">',
    "        <div>",
    '          <p class="eyebrow eyebrow-dark">All articles</p>',
    '          <h2 id="reading-title">A useful place to start.</h2>',
    "        </div>",
    "        <p>No jargon for its own sake. Just a clearer way to think about the work in front of you.</p>",
    "      </div>",
    '      <div class="article-grid">',
    articles.map(cardMarkup).join("\n"),
    "      </div>",
    "    </div>",
    "  </section>",
    "</main>",
    siteFooter({ assetPrefix: "../", rootHref: "../" }),
    '  <script type="module" src="../script.js"></script>',
    "</body>",
    "</html>",
    "",
  ].join("\n");
}

function relatedMarkup(article, articles) {
  return articles
    .filter((candidate) => candidate.slug !== article.slug)
    .slice(0, 2)
    .map((candidate) => {
      const presentation = articlePresentation[candidate.slug];

      return [
        "<li>",
        '  <a href="../' + candidate.slug + '/">',
        "    <span>" + escapeHtml(presentation.label) + "</span>",
        "    " + escapeHtml(candidate.title),
        "  </a>",
        "</li>",
      ].join("\n");
    })
    .join("\n");
}

function renderArticle(article, articles) {
  const presentation = articlePresentation[article.slug];

  return [
    pageHead({
      title: article.title,
      description: article.description,
      canonicalUrl: article.canonicalUrl,
      stylesHref: "../../",
      schema: articleSchema(article),
    }),
    '<body class="article-page article-detail-page">',
    siteHeader({
      assetPrefix: "../../",
      rootHref: "../../",
      articlesHref: "../",
      ctaHref: "../../#contact",
      articleIndex: false,
    }),
    '<main id="main-content" class="article-main">',
    '  <section class="article-detail-intro" aria-labelledby="article-title">',
    '    <div class="shell article-detail-intro__copy">',
    '      <a class="article-back-link" href="../">All articles</a>',
    '      <p class="eyebrow eyebrow-dark">' + escapeHtml(presentation.topic) + "</p>",
    '      <h1 id="article-title">' + escapeHtml(article.title) + "</h1>",
    '      <p class="article-detail-intro__description">' + escapeHtml(article.description) + "</p>",
    '      <p class="article-detail-intro__audience"><strong>For:</strong> ' + escapeHtml(article.audience) + "</p>",
    "    </div>",
    "  </section>",
    '  <section class="article-detail-body">',
    '    <div class="shell article-detail-grid">',
    '      <article class="article-prose">',
    renderMarkdown(article.body),
    "      </article>",
    '      <aside class="article-aside" aria-label="Work with Singularity Shift">',
    '        <p class="article-aside__title">Need a clear next step?</p>',
    "        <p>From a first idea to a difficult system, you can bring the rough outline. We will work out the most useful next move together.</p>",
    '        <a class="button button-dark" href="../../#contact">Describe the problem</a>',
    '        <div class="article-aside__divider"></div>',
    '        <p><strong>Continue reading</strong></p>',
    "        <ul>",
    relatedMarkup(article, articles),
    "        </ul>",
    "      </aside>",
    "    </div>",
    "  </section>",
    '  <section class="article-cta" aria-labelledby="article-cta-title">',
    '    <div class="shell article-cta__grid">',
    "      <div>",
    '        <p class="eyebrow">Work directly with James</p>',
    '        <h2 id="article-cta-title">Bring the work that is getting in the way.</h2>',
    "      </div>",
    "      <div>",
    "        <p>Whether you are one person with an idea or a larger organisation with a difficult system, no project is too small to start a useful conversation.</p>",
    '        <a class="button button-accent" href="../../#contact">Start a project</a>',
    "      </div>",
    "    </div>",
    "  </section>",
    "</main>",
    siteFooter({ assetPrefix: "../../", rootHref: "../../" }),
    '  <script type="module" src="../../script.js"></script>',
    "</body>",
    "</html>",
    "",
  ].join("\n");
}

async function loadArticle(filename) {
  const source = await readFile(resolve(contentDir, filename), "utf8");
  const { meta, body } = parseFrontMatter(source, filename);

  return {
    ...meta,
    body,
    canonicalUrl: "https://sshift.xyz/articles/" + meta.slug + "/",
  };
}

async function generate() {
  const articles = [];

  for (const filename of articleOrder) {
    articles.push(await loadArticle(filename));
  }

  await mkdir(outputDir, { recursive: true });
  await writeFile(resolve(outputDir, "index.html"), renderIndex(articles), "utf8");

  for (const article of articles) {
    const articleDir = resolve(outputDir, article.slug);
    await mkdir(articleDir, { recursive: true });
    await writeFile(resolve(articleDir, "index.html"), renderArticle(article, articles), "utf8");
  }

  console.log("Generated " + articles.length + " article pages in /articles/.");
}

generate().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
