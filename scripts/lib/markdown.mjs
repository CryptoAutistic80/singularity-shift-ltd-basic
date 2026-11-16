export const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const renderInline = (value) =>
  escapeHtml(value)
    .replace(
      /\[([^\]]+)\]\(((?:https?:\/\/|mailto:|\.\.?\/|\/(?!\/)|#)[^\s)]+)\)/g,
      (_, label, href) => {
        const external = /^https?:\/\//.test(href) && new URL(href).hostname !== "sshift.xyz";
        return '<a href="' + href + '"' + (external ? ' target="_blank" rel="noopener noreferrer"' : '') + '>' + label + '</a>';
      },
    )
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\x60([^\x60]+)\x60/g, "<code>$1</code>");

export function markdownHeadings(markdown) {
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

export function renderMarkdown(markdown) {
  const lines = markdown.split(/\r?\n/);
  const blocks = [];
  let index = 0;
  let headingIndex = 0;
  const headings = markdownHeadings(markdown);
  const startsBlock = (line) =>
    /^#{1,3} /.test(line) ||
    /^[-*] .+/.test(line) ||
    /^\d+\. .+/.test(line) ||
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
