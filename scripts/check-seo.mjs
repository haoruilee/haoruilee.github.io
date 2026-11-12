import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { legacyRedirects } from './legacy-redirects.mjs';

const root = new URL('../dist/', import.meta.url);
const redirects = legacyRedirects();
const sitemap = fs.readFileSync(new URL('sitemap.xml', root), 'utf8');
const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
assert.equal(new Set(locations).size, locations.length);
for (const location of locations) {
  const url = new URL(location);
  assert.equal(url.origin, 'https://lihaorui.com');
  assert.equal(url.search, '');
  assert.ok(url.pathname.endsWith('/'));
  const html = fs.readFileSync(path.join(root.pathname, decodeURIComponent(url.pathname), 'index.html'), 'utf8');
  const canonicals = [...html.matchAll(/<link\s+rel="canonical"\s+href="([^"]+)"/g)];
  assert.equal(canonicals.length, 1, location);
  assert.equal(canonicals[0][1], location);
  assert.ok(!/noindex|http-equiv="refresh"/i.test(html), location);
}
for (const [from, to] of Object.entries(redirects)) {
  assert.ok(locations.includes(new URL(to, 'https://lihaorui.com').href));
  const html = fs.readFileSync(path.join(root.pathname, from, 'index.html'), 'utf8');
  assert.ok(html.includes('http-equiv="refresh"'), from);
  assert.ok(decodeURIComponent(html).includes(to), from);
  assert.ok(!locations.includes(`https://lihaorui.com${from}`));
}
for (const file of ['BingSiteAuth.xml', 'a7f3c91e4b2d80f65e1a9c3d7b4e2f10.txt', 'robots.txt']) {
  assert.ok(fs.statSync(new URL(file, root)).size > 0, file);
}
assert.equal(redirects['/2025/02/05/deepseek-math-reading/'], '/blog/deepseek-math-reading/');
console.log(JSON.stringify({canonicalPages: locations.length, legacyRedirects: Object.keys(redirects).length, verificationFiles: 3}));
