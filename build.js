#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = __dirname;
const LOCALES = ['fr', 'en'];

function resolve(obj, dotPath) {
  return dotPath.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}

function render(template, strings, source) {
  return template.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_match, key) => {
    const value = resolve(strings, key);
    if (value === undefined) {
      throw new Error(`Missing string "${key}" in ${source}`);
    }
    return String(value);
  });
}

function build(pageDir) {
  const pageRoot = path.join(ROOT, pageDir);
  const template = fs.readFileSync(path.join(pageRoot, '_template.html'), 'utf8');

  for (const locale of LOCALES) {
    const stringsPath = path.join(pageRoot, `_strings.${locale}.json`);
    const strings = JSON.parse(fs.readFileSync(stringsPath, 'utf8'));
    const html = render(template, strings, stringsPath);
    const outDir = locale === 'fr' ? pageRoot : path.join(pageRoot, locale);
    fs.mkdirSync(outDir, { recursive: true });
    const outPath = path.join(outDir, 'index.html');
    fs.writeFileSync(outPath, html);
    console.log(`  ✓ ${path.relative(ROOT, outPath)}`);
  }
}

const pages = ['spellfix'];

console.log('Building bilingual pages…');
for (const page of pages) {
  console.log(`\n${page}/`);
  build(page);
}
console.log('\nDone.');
