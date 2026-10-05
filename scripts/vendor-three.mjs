import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
const root = new URL("../", import.meta.url);
const vendor = new URL("assets/vendor/", root);
await mkdir(vendor, { recursive: true });
for (const [source, destination] of [["build/three.module.js", "three.module.js"], ["build/three.core.js", "three.core.js"], ["LICENSE", "THREE-LICENSE.txt"]]) {
  await copyFile(new URL("node_modules/three/" + source, root), new URL(destination, vendor));
}
const { version } = JSON.parse(await readFile(new URL("node_modules/three/package.json", root), "utf8"));
await writeFile(new URL("README.md", vendor), `Three.js ${version}, MIT licence. Vendored from the pinned npm package for GitHub Pages, which serves the repository root. Only the LUMA concept loads these modules. Run \`npm run vendor:three\` after updating the dependency.\n`);
console.log(`Vendored Three.js ${version} for the LUMA concept.`);
