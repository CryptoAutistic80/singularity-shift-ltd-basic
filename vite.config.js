import { existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const rootDir = fileURLToPath(new URL(".", import.meta.url));
const articlesDir = resolve(rootDir, "articles");
const input = {
  home: resolve(rootDir, "index.html"),
};

if (existsSync(articlesDir)) {
  input.articles = resolve(articlesDir, "index.html");

  for (const entry of readdirSync(articlesDir, { withFileTypes: true })) {
    const page = resolve(articlesDir, entry.name, "index.html");

    if (entry.isDirectory() && existsSync(page)) {
      input["article-" + entry.name] = page;
    }
  }
}

const servicesDir = resolve(rootDir, "services");
if (existsSync(servicesDir)) {
  for (const entry of readdirSync(servicesDir, { withFileTypes: true })) {
    const page = resolve(servicesDir, entry.name, "index.html");
    if (entry.isDirectory() && existsSync(page)) {
      input["service-" + entry.name] = page;
    }
  }
}

export default defineConfig({
  server: {
    host: "0.0.0.0",
    allowedHosts: ["terminal.local"],
  },
  build: {
    rollupOptions: {
      input,
    },
  },
});
