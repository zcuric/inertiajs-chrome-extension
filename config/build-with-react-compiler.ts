import Bun, { $ } from "bun";
import { existsSync } from "fs";
import path from "path";

import "./cwd";
import manifest from "../public/manifest.json";

const outdir = "./build";
const tempdir = "./temp-compiled";

const {
  content_scripts,
  background: { service_worker },
} = manifest;

const scripts = content_scripts.flatMap((script) => script.js);

const resolveEntryPoints = (entrypoints: string[]) => {
  return entrypoints.map((entrypoint) => `${tempdir}/${entrypoint}`);
};

const publicFolder = "./public";

// Clean up previous builds
await $`rm -rf ${outdir}`;
await $`rm -rf ${tempdir}`;

const ext = {
  html: ".html",
  png: ".png",
  css: ".css",
};

console.log("🚀 Running React Compiler transformation...");

// Step 1: Transform source code with React Compiler via Babel
await $`npx babel src --out-dir ${tempdir} --extensions .ts,.tsx,.js,.jsx --copy-files`;

console.log("✅ React Compiler transformation complete!");
console.log("📦 Building with Bun...");

// Step 2: Build with Bun using the transformed source (Babel converts .ts/.tsx to .js)
await Bun.build({
  target: "browser",
  entrypoints: resolveEntryPoints([
    ...scripts,
    service_worker,
    "devtools/devtools.js",
    "panel/index.js",
  ]),
  outdir,
});

console.log("✅ Bun build complete!");

// Step 3: Process Tailwind CSS
await $`tailwindcss -i ${publicFolder}/main.css -o ${outdir}/main.css --minify`;
console.log("✅ Tailwind CSS processed!");

// Step 4: Copy public assets
const { Glob } = Bun;
const glob = new Glob("**");

for await (const filename of glob.scan(publicFolder)) {
  const file = Bun.file(`${publicFolder}/${filename}`);

  if (!file.exists()) throw new Error(`File ${filename} does not exist`);

  if (filename.endsWith(ext.png) || filename.endsWith(ext.css)) continue;

  if (filename.endsWith(ext.html)) {
    const fileFolder = filename.replace(ext.html, "");

    await $`mkdir -p ${outdir}/${fileFolder}`;

    // rename files to index.html since it's being copied into a folder that share its original name
    await $`cp ${file.name} ${outdir}/${fileFolder}/index.html`;
    // copy the generated css file into the folder
    await $`cp ${outdir}/main.css ${outdir}/${fileFolder}/main.css`;
  } else {
    await $`cp ${file.name} ${outdir}`;
  }
}

await $`cp -R ${publicFolder}/icons ${outdir}`;
await $`cp ./src/injected.js ${outdir}`;

// Step 5: Clean up temporary files
await $`rm -rf ${tempdir}`;

console.log("✅ Build complete with React Compiler optimizations!");
