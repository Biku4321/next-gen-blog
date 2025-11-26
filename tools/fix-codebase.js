#!/usr/bin/env node
/**
 * fix-codebase.js
 * - Run: node tools/fix-codebase.js        (preview only)
 * - Or:  node tools/fix-codebase.js --apply
 *
 * It will:
 * - Replace `.prev` -> '...prev' and `.form` -> '...form' in .js/.jsx files
 * - Replace occurrences of '/post/' -> '/posts/' in strings and JSX (preview first)
 * - Find localStorage usage and prepend a TODO guard comment (preview)
 * - Report files containing "<useUserDarkMode/>"
 * - Report likely import casing mismatches (best-effort)
 */

const fs = require("fs");
const path = require("path");
const glob = require("glob");
const process = require("process");

const root = process.cwd();
const apply = process.argv.includes("--apply");

console.log(`Running fixer in ${apply ? "APPLY" : "PREVIEW"} mode on ${root}\n`);

const patterns = ["src/**/*.js", "src/**/*.jsx", "src/**/*.ts", "src/**/*.tsx"];

const files = patterns
  .map((p) => glob.sync(p, { nodir: true }))
  .reduce((a, b) => a.concat(b), [])
  .filter(Boolean);

if (!files.length) {
  console.log("No source files found under src/. Exiting.");
  process.exit(0);
}

const report = {
  replaced: [],
  localStorageFound: [],
  useUserDarkModeFiles: [],
  postLinks: [],
  caseMismatchCandidates: [],
};

function readFile(file) {
  return fs.readFileSync(file, "utf8");
}

function writeFile(file, content) {
  fs.writeFileSync(file, content, "utf8");
}

files.forEach((file) => {
  let content = readFile(file);
  let original = content;
  let changed = false;

  // Replace .prev and .form typos but avoid replacing valid occurrences like object keys (heuristic)
  // Replace `(.prev` and ` .prev` and `({ .prev,` patterns
  const prevRegex = /(\W)\.prev\b/g;
  const formRegex = /(\W)\.form\b/g;

  if (prevRegex.test(content)) {
    content = content.replace(prevRegex, (m, g1) => `${g1}...prev`);
    changed = true;
    report.replaced.push({ file, change: ".prev -> ...prev" });
  }
  if (formRegex.test(content)) {
    content = content.replace(formRegex, (m, g1) => `${g1}...form`);
    changed = true;
    report.replaced.push({ file, change: ".form -> ...form" });
  }

  // Replace <useUserDarkMode/> occurrences (report only)
  if (content.includes("<useUserDarkMode/>") || content.includes("<UserDarkMode/>")) {
    report.useUserDarkModeFiles.push(file);
    // we don't auto-replace usage; it requires manual placement of hook call inside function
    // However we mark it and optionally add a comment.
    content = content.replace(/<UserDarkMode\s*\/>/g, "<!-- TODO: UserDarkMode component removed. Call useUserDarkMode() hook inside component body. -->");
    content = content.replace(/<useUserDarkMode\s*\/>/g, "<!-- TODO: useUserDarkMode hook should be called inside a component body. -->");
    changed = true;
  }

  // Replace "/post/" -> "/posts/" in strings/JSX (preview only)
  const postLinkRegex = /(["'`])\/post\/([^\s"'`<>]*)\1/g;
  if (postLinkRegex.test(content)) {
    const matches = [...content.matchAll(postLinkRegex)];
    report.postLinks.push({ file, matches: matches.map(m => m[0]) });
    content = content.replace(postLinkRegex, (m, p1, p2) => `${p1}/posts/${p2}${p1}`);
    changed = true;
  }

  // Find localStorage uses and add TODO comment above line (preview)
  const localRegex = /(.*)(localStorage\.(getItem|setItem|removeItem|clear)\s*\()/g;
  if (localRegex.test(content)) {
    report.localStorageFound.push(file);
    // Insert a comment above first occurrence (only once)
    content = content.replace(localRegex, (m, before, call) => {
      const comment = "// TODO: guard localStorage access for SSR: check typeof window !== 'undefined'\n";
      return comment + before + call;
    });
    changed = true;
  }

  // Check for possible import case mismatch: find import paths and validate file exists
  const importRegex = /import\s+(?:[\s\S]+?)\s+from\s+["'](.+?)["']/g;
  let importMatch;
  let mismatchFoundForFile = false;
  while ((importMatch = importRegex.exec(content)) !== null) {
    const imp = importMatch[1];
    if (imp.startsWith(".") || imp.startsWith("/")) {
      const possibleExts = ["", ".js", ".jsx", ".ts", ".tsx", ".json"];
      const resolvedPath = path.resolve(path.dirname(file), imp);
      const exists = possibleExts.some((ext) => {
        try {
          return fs.existsSync(resolvedPath + ext) || fs.existsSync(path.join(resolvedPath, "index" + ext));
        } catch { return false; }
      });
      if (!exists) {
        report.caseMismatchCandidates.push({ file, importPath: imp });
        mismatchFoundForFile = true;
      }
    }
  }

  if (changed) {
    if (apply) {
      writeFile(file, content);
      console.log(`APPLIED changes to ${file}`);
    } else {
      console.log(`PREVIEW changes for ${file}`);
    }
  }
});

console.log("\n--- FIXER REPORT ---\n");
console.log(`Files scanned: ${files.length}`);
console.log(`.prev/.form replacements: ${report.replaced.length}`);
console.log(`Files with localStorage occurrences: ${report.localStorageFound.length}`);
console.log(`Files with <useUserDarkMode/> usage: ${report.useUserDarkModeFiles.length}`);
console.log(`Post -> Posts link matches found: ${report.postLinks.length}`);
console.log(`Potential import path mismatches: ${report.caseMismatchCandidates.length}`);

if (report.useUserDarkModeFiles.length) {
  console.log("\nFiles containing <useUserDarkMode/> or <UserDarkMode/> (fix manually):");
  report.useUserDarkModeFiles.forEach(f => console.log("  - " + f));
}
if (report.localStorageFound.length) {
  console.log("\nFiles with localStorage usage (review & guard):");
  report.localStorageFound.forEach(f => console.log("  - " + f));
}
if (report.caseMismatchCandidates.length) {
  console.log("\nPotential import path mismatches (manual review):");
  report.caseMismatchCandidates.forEach(i => {
    console.log(`  - ${i.file} -> import "${i.importPath}"`);
  });
}
console.log("\nTo apply changes re-run with --apply\n");
