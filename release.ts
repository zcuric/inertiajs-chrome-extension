#!/usr/bin/env bun
// Release script for Inertia.js Chrome Extension using Bun
// Usage: bun run release.ts <new_version>

import { $ } from "bun";

const [,, bumpType] = process.argv;

if (!bumpType || !["patch", "minor", "major"].includes(bumpType)) {
  console.error("Usage: bun run release.ts <patch|minor|major>");
  process.exit(1);
}

import fs from "fs";

function bumpVersion(version: string, type: string) {
  const parts = version.split(".").map(Number);
  if (type === "patch") {
    parts[2]++;
  } else if (type === "minor") {
    parts[1]++;
    parts[2] = 0;
  } else if (type === "major") {
    parts[0]++;
    parts[1] = 0;
    parts[2] = 0;
  }
  return parts.join(".");
}

function updateJsonVersion(path: string, version: string) {
  const json = JSON.parse(fs.readFileSync(path, "utf8"));
  json.version = version;
  fs.writeFileSync(path, JSON.stringify(json, null, 2) + "\n");
  console.log(`Updated ${path} to version ${version}`);
}

// Read current version from package.json
const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
const currentVersion = pkg.version;
const newVersion = bumpVersion(currentVersion, bumpType);

updateJsonVersion("public/manifest.json", newVersion);
updateJsonVersion("package.json", newVersion);

await $`git add public/manifest.json package.json`;
await $`git commit -m "chore: bump extension version to ${newVersion}"`;
console.log("Committed version bump.");

await $`git tag v${newVersion}`;
console.log(`Tagged as v${newVersion}.`);

await $`git push origin v${newVersion}`;
console.log(`Pushed tag v${newVersion} to origin.`);
