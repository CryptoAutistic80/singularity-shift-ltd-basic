import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL("../", import.meta.url));
const contentDir = resolve(rootDir, "content", "articles");
const outputDir = resolve(rootDir, "articles");
const sitemapPath = resolve(rootDir, "sitemap.xml");
const textSitemapPath = resolve(rootDir, "sitemap.txt");
const robotsPath = resolve(rootDir, "robots.txt");

const categories = {
  design: { title: "Design ideas & working examples", description: "Explore brand, motion and product experiences through original working concepts, with practical advice for your own website." },
  planning: { title: "Plan your website", description: "Choose a developer, compare approaches and turn a rough idea into a clear brief." },
  improve: { title: "Improve an existing website", description: "Find the problems behind slow pages, missed enquiries and difficult updates." },
  functionality: { title: "Bookings, shops & web applications", description: "Work out what customers and staff need to do online before choosing a system." },
  "business-types": { title: "Websites for your kind of business", description: "Different businesses need different journeys, from a trade enquiry to an accommodation booking." },
  software: { title: "Software & business processes", description: "Explore custom tools, scope and practical uses of automation." },
};

const articlePresentation = {
  "ai-agents-cheltenham-businesses": {
    category: "software", order: 43,
    topic: "Applied AI · Systems design",
    label: "AI agents",
    related: ["applied-ai-cheltenham", "when-spreadsheets-hold-you-back"],
    service: "software",
  },
  "applied-ai-cheltenham": {
    category: "software", order: 42,
    topic: "Applied AI · Practical adoption",
    label: "Applied AI",
    related: ["ai-agents-cheltenham-businesses", "when-spreadsheets-hold-you-back"],
    service: "software",
  },
  "web-development-cheltenham": {
    category: "planning", order: 18,
    topic: "Websites · Planning your project",
    label: "Websites",
    related: ["choosing-web-developer-cheltenham", "website-builder-vs-web-developer", "web-app-developer-cheltenham"],
    service: "websites",
  },
  "bespoke-software-cost-cheltenham": {
    category: "software", order: 41,
    topic: "Bespoke software · Scoping",
    label: "Bespoke software",
    related: ["when-spreadsheets-hold-you-back", "web-development-cheltenham"],
    service: "software",
  },
  "when-spreadsheets-hold-you-back": {
    category: "software", order: 40,
    topic: "Operations · Process improvement",
    label: "Operations",
    related: ["bespoke-software-cost-cheltenham", "web-development-cheltenham"],
    service: "software",
  },
};

const conceptPresentation = {
  collection: { path: "concepts/", name: "The concept collection", image: "collection-preview.png", alt: "Three working website concepts: DAYBREAK coffee, FIELD / FORM architecture and LUMA lighting", description: "Compare three different website experiences and see the design decisions in action." },
  daybreak: { path: "concepts/daybreak/", name: "DAYBREAK", image: "daybreak-preview.png", alt: "DAYBREAK coffee concept with layered photography, expressive lettering and a flavour finder", description: "Explore layered coffee imagery, a flavour finder and a personal tasting list." },
  "field-form": { path: "concepts/field-form/", name: "FIELD / FORM", image: "field-preview.png", alt: "FIELD / FORM architecture concept during its expanding photographic scroll sequence", description: "Try an architectural scroll story, project briefs and a colour-to-monochrome image study." },
  luma: { path: "concepts/luma/", name: "LUMA / 01", image: "luma-preview.png", alt: "LUMA lighting concept showing the parts of an interactive 3D lamp separated in an exploded view", description: "On desktop, scroll to take the lamp apart. Try its finishes, shade shapes and lighting controls on desktop or mobile." },
};

const servicePresentation = {
  websites: {
    path: "services/web-design-cheltenham/",
    label: "Website design & development",
    title: "Planning a new or better website?",
    description: "Work directly with James on a website that explains your business, shows your work and makes the next step easy.",
    ctaTitle: "Let’s make your website work for your business.",
    ctaDescription: "Tell me what you do, who you want to reach and what your current website needs to do better. A rough outline is enough to begin.",
  },
  software: {
    path: "services/custom-software-cheltenham/",
    label: "Custom software & integrations",
    title: "Have a process you want to improve?",
    description: "Bring the tools you use and the work that slows you down. We can identify a useful first step, with AI included where it earns its place.",
    ctaTitle: "Make one difficult piece of work easier.",
    ctaDescription: "Tell me what happens today, where it becomes frustrating and what a better result would look like. We can shape the scope around the actual problem.",
  },
};

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

function sitemapUrls(articles) {
  return [
    "https://sshift.xyz/",
    "https://sshift.xyz/services/web-design-cheltenham/",
    "https://sshift.xyz/services/custom-software-cheltenham/",
    "https://sshift.xyz/articles/",
    "https://sshift.xyz/concepts/",
    ...articles.map((article) => article.canonicalUrl),
  ];
}

function renderSitemap(articles) {
  const urls = sitemapUrls(articles);

  return [
    "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
    "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">",
    ...urls.map((url) => "  <url><loc>" + url + "</loc></url>"),
    "</urlset>",
    "",
  ].join(String.fromCharCode(10));
}

function renderTextSitemap(articles) {
  return [...sitemapUrls(articles), ""].join(String.fromCharCode(10));
}

function renderRobots() {
  return [
    "User-agent: *",
    "Allow: /",
    "",
    "Sitemap: https://sshift.xyz/sitemap.xml",
    "",
  ].join(String.fromCharCode(10));
}

const renderInline = (value) =>
  escapeHtml(value)
    .replace(
      /\[([^\]]+)\]\(((?:https?:\/\/|\.\.?\/|\/(?!\/)|#)[^\s)]+)\)/g,
      (_, label, href) => {
        const external = /^https?:\/\//.test(href) && new URL(href).hostname !== "sshift.xyz";
        return '<a href="' + href + '"' + (external ? ' target="_blank" rel="noopener noreferrer"' : '') + '>' + label + '</a>';
      },
    )
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\x60([^\x60]+)\x60/g, "<code>$1</code>");

function articleHeadings(markdown) {
  const used = new Set();
  return markdown.split(/\r?\n/).filter((line) => line.startsWith("## ")).map((line) => {
    const title = line.slice(3);
    const base = title.normalize("NFKD").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section";
    let id = base;
    let suffix = 2;
    while (used.has(id)) id = base + "-" + suffix++;
    used.add(id);
    return { title, id };
  });
}

function renderContents(article) {
  return '<nav class="article-contents" aria-label="In this guide"><p><strong>In this guide</strong></p><ol>' +
    articleHeadings(article.body).map(({ title, id }) => '<li><a href="#' + id + '">' + renderInline(title) + '</a></li>').join("") + '</ol></nav>';
}

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
  let headingIndex = 0;
  const headings = articleHeadings(markdown);
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
      blocks.push('<h2 id="' + headings[headingIndex++].id + '">' + renderInline(line.slice(3)) + "</h2>");
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

function pageHead({ title, description, canonicalUrl, stylesHref, schema, ogType = "article", image = "https://sshift.xyz/assets/social-preview.jpg", imageAlt = "Singularity Shift Ltd — website design and software development" }) {
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
    '  <meta property="og:type" content="' + ogType + '">',
    '  <meta property="og:url" content="' + canonicalUrl + '">',
    '  <meta property="og:image" content="' + escapeHtml(image) + '">',
    '  <meta property="og:image:alt" content="' + escapeHtml(imageAlt) + '">',
    '  <meta name="twitter:card" content="summary_large_image">',
    '  <meta name="twitter:title" content="' + escapedTitle + '">',
    '  <meta name="twitter:description" content="' + escapedDescription + '">',
    '  <meta name="twitter:image" content="' + escapeHtml(image) + '">',
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
    '      <a href="' + rootHref + 'services/web-design-cheltenham/">Websites</a>',
    '      <a href="' + rootHref + 'services/custom-software-cheltenham/">Software</a>',
    '      <a href="' + rootHref + '#work">Work</a>',
    '      <a href="' + rootHref + 'concepts/">Concepts</a>',
    '      <a href="' + articlesHref + '"' + current + ">Guides</a>",
    '      <a href="' + rootHref + '#about">About</a>',
    '      <a class="mobile-contact" href="' + ctaHref + '">Contact</a>',
    "    </nav>",
    '    <div class="nav-actions">',
    '      <button class="menu-toggle button button-small button-ghost" type="button" data-menu-toggle aria-controls="site-nav" aria-expanded="false">',
    '        <span data-menu-label>Menu</span>',
    "      </button>",
    '      <a class="button button-small button-accent" href="' + ctaHref + '">Contact</a>',
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
  const presentation = article.presentation;
  const number = String(position + 1).padStart(2, "0");

  return [
    '<a class="article-card" href="./' + article.slug + '/">',
    '  <span class="article-card__topline">',
    '    <span class="article-card__number">' + number + "</span>",
    '    <span class="article-card__topic">' + escapeHtml(presentation.topic) + "</span>",
    "  </span>",
    "  <h3>" + escapeHtml(article.title) + "</h3>",
    "  <p>" + escapeHtml(article.description) + "</p>",
    '  <span class="article-card__read">Read guide · ' + article.readMinutes + ' min</span>',
    "</a>",
  ].join("\n");
}

function articleSchema(article) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: article.title,
        description: article.description,
        mainEntityOfPage: article.canonicalUrl,
        articleSection: categories[article.presentation.category].title,
        author: { "@type": "Person", name: "James Walford", url: "https://sshift.xyz/#about" },
        publisher: { "@type": "Organization", name: "Singularity Shift Ltd", url: "https://sshift.xyz/" },
        inLanguage: "en-GB",
        ...(article.concept ? { image: ["https://sshift.xyz/concepts/assets/" + conceptPresentation[article.concept].image] } : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://sshift.xyz/" },
          { "@type": "ListItem", position: 2, name: "Guides", item: "https://sshift.xyz/articles/" },
          { "@type": "ListItem", position: 3, name: article.title, item: article.canonicalUrl },
        ],
      },
    ],
  };
}

function renderIndex(articles) {
  const groups = Object.entries(categories).map(([id, category]) => ({
    id, ...category, articles: articles.filter((article) => article.presentation.category === id),
  })).filter((category) => category.articles.length);
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Website Guides for Cheltenham Businesses",
    description: "Practical guides to choosing a website developer, planning a build and improving your business website.",
    url: "https://sshift.xyz/articles/",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: articles.map((article, index) => ({
        "@type": "ListItem", position: index + 1, name: article.title, url: article.canonicalUrl,
      })),
    },
  };
  return [
    pageHead({
      title: "Website Guides for Cheltenham Businesses",
      description: "Choosing a website builder or developer in Cheltenham? Explore practical guides to costs, redesigns, local search, bookings and better business websites.",
      canonicalUrl: "https://sshift.xyz/articles/", stylesHref: "../", schema, ogType: "website",
    }),
    '<body class="article-page article-index-page">',
    siteHeader({ assetPrefix: "../", rootHref: "../", articlesHref: "./", ctaHref: "../#contact", articleIndex: true }),
    '<main id="main-content" class="article-main">',
    '<section class="article-index-hero" aria-labelledby="articles-title"><div class="shell article-index-hero__copy">',
    '<p class="eyebrow">Cheltenham · Website &amp; software guides</p>',
    '<h1 id="articles-title">A clearer plan for <em>your website.</em></h1>',
    '<p class="article-lede">Choosing a website builder or developer in Cheltenham? Find useful answers about costs, the right approach and what your customers need from your site.</p>',
    '<p class="article-index-hero__note">' + articles.length + ' practical guides · James Walford, Cheltenham</p>',
    '</div></section>',
    '<section class="article-index-section" aria-labelledby="reading-title"><div class="shell">',
    '<div class="article-index-heading"><div><p class="eyebrow eyebrow-dark">Start with your question</p><h2 id="reading-title">What are you working on?</h2></div>',
    '<p>Browse the guides, or <a class="text-link" href="../services/web-design-cheltenham/">explore website design and development</a> if you are ready to discuss a project.</p></div>',
    '<nav class="article-topics" aria-label="Guide topics">' + groups.map((group) => '<a href="#' + group.id + '">' + escapeHtml(group.title) + ' <span>' + group.articles.length + '</span></a>').join("") + '</nav>',
    groups.map((group) => [
      '<section class="article-category" aria-labelledby="' + group.id + '">',
      '<div class="article-category-heading"><h2 id="' + group.id + '">' + escapeHtml(group.title) + '</h2><p>' + escapeHtml(group.description) + '</p></div>',
      '<div class="article-grid">', group.articles.map((article) => cardMarkup(article, articles.indexOf(article))).join("\n"), '</div></section>',
    ].join("\n")).join("\n"),
    '</div></section></main>',
    siteFooter({ assetPrefix: "../", rootHref: "../" }),
    '<script type="module" src="../script.js"></script>', '</body>', '</html>', '',
  ].join("\n");
}

function relatedMarkup(article, articles) {
  return article.presentation.related
    .map((slug) => articles.find((candidate) => candidate.slug === slug))
    .map((candidate) => {
      const presentation = candidate.presentation;

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

function renderConceptArticleBody(article) {
  const body = renderMarkdown(article.body);
  const concept = conceptPresentation[article.concept];
  if (!concept) return body;
  const preview = [
    '<figure class="article-concept" data-concept="' + escapeHtml(article.concept) + '">',
    '<a class="article-concept__image" href="../../' + concept.path + '" aria-label="Explore ' + escapeHtml(concept.name) + ', a working website concept"><img src="../../concepts/assets/' + concept.image + '" alt="' + escapeHtml(concept.alt) + '" width="1425" height="990" loading="lazy"></a>',
    '<figcaption><p class="article-concept__eyebrow">See the idea in action</p>',
    '<p class="article-concept__title">' + escapeHtml(concept.name) + '</p>',
    '<p>' + escapeHtml(concept.description) + '</p>',
    '<p class="article-concept__note">Original concepts for fictional brands, created by Singularity Shift.</p>',
    '<div class="article-concept__links"><a href="../../' + concept.path + '">Try the working concept <span aria-hidden="true">↗</span></a><a href="../../#contact">Discuss an idea like this <span aria-hidden="true">→</span></a></div>',
    '</figcaption></figure>',
  ].join("\n");
  const firstSection = body.indexOf('<h2 ');
  return firstSection === -1 ? body + preview : body.slice(0, firstSection) + preview + "\n" + body.slice(firstSection);
}

function renderArticle(article, articles) {
  const presentation = article.presentation;
  const service = servicePresentation[presentation.service];
  const concept = conceptPresentation[article.concept];
  const message = concept
    ? 'Hi James, I would like to discuss a website project. I found your guide: "' + article.title + '" (' + concept.name + ').'
    : "Hi James, I'd like to discuss a website or software project.";
  const whatsappHref = "https://wa.me/447540456767?text=" + encodeURIComponent(message);

  return [
    pageHead({
      title: article.title,
      description: article.description,
      canonicalUrl: article.canonicalUrl,
      stylesHref: "../../",
      schema: articleSchema(article),
      ...(concept ? { image: "https://sshift.xyz/concepts/assets/" + concept.image, imageAlt: concept.alt } : {}),
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
    '      <a class="article-back-link" href="../#' + presentation.category + '">' + escapeHtml(categories[presentation.category].title) + '</a>',
    '      <p class="eyebrow eyebrow-dark">' + escapeHtml(presentation.topic) + "</p>",
    '      <h1 id="article-title">' + escapeHtml(article.title) + "</h1>",
    '      <p class="article-detail-intro__description">' + escapeHtml(article.description) + "</p>",
    '      <p class="article-detail-intro__audience">By <a href="../../#about" rel="author"><strong>James Walford</strong></a> · Website designer &amp; software developer, Cheltenham</p>',
    '      <p class="article-detail-intro__audience">' + article.readMinutes + ' min read · <strong>For:</strong> ' + escapeHtml(article.audience) + '</p>',
    "    </div>",
    "  </section>",
    '  <section class="article-detail-body">',
    '    <div class="shell article-detail-grid">',
    '      <article class="article-prose">',
    renderContents(article),
    renderConceptArticleBody(article),
    "      </article>",
    '      <aside class="article-aside" aria-label="Work with Singularity Shift">',
    '        <p class="article-aside__title">' + escapeHtml(service.title) + '</p>',
    '        <p>' + escapeHtml(service.description) + '</p>',
    '        <p><a href="../../' + service.path + '">' + escapeHtml(service.label) + ' →</a></p>',
    '        <a class="button button-dark" href="../../#contact">Tell me about your project</a>',
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
    '        <h2 id="article-cta-title">' + escapeHtml(service.ctaTitle) + '</h2>',
    "      </div>",
    "      <div>",
    '        <p>' + escapeHtml(service.ctaDescription) + '</p>',
    '        <div class="contact-actions">',
    '          <a class="button button-accent" href="../../#contact">Tell me about your project</a>',
    '          <a class="button button-ghost button-whatsapp" href="' + escapeHtml(whatsappHref) + '" target="_blank" rel="noopener noreferrer"><svg class="whatsapp-icon" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z"/><path d="M8 11.5h.01M12 11.5h.01M16 11.5h.01"/></svg><span>Message James on WhatsApp<span class="visually-hidden"> (opens in a new tab)</span></span></a>',
    '        </div>',
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
  const legacy = articlePresentation[meta.slug];
  const presentation = legacy || {
    category: meta.category, topic: meta.topic, label: meta.label, service: meta.service,
    related: (meta.related || "").split(",").map((slug) => slug.trim()).filter(Boolean), order: Number(meta.order),
  };
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(meta.slug) || filename !== meta.slug + ".md") throw new Error("Invalid slug in " + filename);
  if (!categories[presentation.category] || !servicePresentation[presentation.service] || !presentation.topic || !presentation.label || !Number.isFinite(presentation.order)) throw new Error("Invalid presentation metadata in " + filename);
  if (meta.concept && !conceptPresentation[meta.concept]) throw new Error("Unknown concept in " + filename);
  if (articleHeadings(body).length < 2) throw new Error("Article needs a useful section structure: " + filename);
  return {
    ...meta, body, presentation,
    readMinutes: Math.max(1, Math.ceil(body.split(/\s+/).length / 220)),
    canonicalUrl: "https://sshift.xyz/articles/" + meta.slug + "/",
  };
}

async function generate() {
  const filenames = (await readdir(contentDir)).filter((name) => name.endsWith(".md") && name !== "README.md");
  const categoryOrder = Object.keys(categories);
  const articles = (await Promise.all(filenames.map(loadArticle))).sort((a, b) =>
    categoryOrder.indexOf(a.presentation.category) - categoryOrder.indexOf(b.presentation.category) ||
    a.presentation.order - b.presentation.order || a.slug.localeCompare(b.slug));
  const slugs = new Set(articles.map((article) => article.slug));
  for (const key of ["slug", "title", "description"]) {
    if (new Set(articles.map((article) => article[key])).size !== articles.length) throw new Error("Duplicate article " + key);
  }
  for (const article of articles) {
    if (article.presentation.related.length < 2 || article.presentation.related.some((slug) => !slugs.has(slug) || slug === article.slug)) throw new Error("Invalid related guides for " + article.slug);
  }

  await mkdir(outputDir, { recursive: true });
  await writeFile(resolve(outputDir, "index.html"), renderIndex(articles), "utf8");
  await writeFile(sitemapPath, renderSitemap(articles), "utf8");
  await writeFile(textSitemapPath, renderTextSitemap(articles), "utf8");
  await writeFile(robotsPath, renderRobots(), "utf8");

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
