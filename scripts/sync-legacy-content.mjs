#!/usr/bin/env node
/**
 * Syncs legacy Hexo content from source/ into Astro collections and public/.
 * Do not edit generated outputs by hand — fix this script and re-run.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SOURCE = path.join(ROOT, 'source');
const OUT_BLOG = path.join(ROOT, 'src', 'content', 'blog');
const OUT_PAGES = path.join(ROOT, 'src', 'content', 'pages');
const OUT_DATA = path.join(ROOT, 'src', 'data');
const PUBLIC = path.join(ROOT, 'public');

const SKIP_COPY_NAMES = new Set(['.obsidian', '.git']);

/** @param {string} p */
function rmrf(p) {
  if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true });
}

/**
 * Best-effort directory cleanup for Windows environments where deleting the
 * directory itself may fail due to missing delete rights on inherited ACLs.
 * @param {string} dir
 */
function emptyDir(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    try {
      if (entry.isDirectory()) {
        rmrf(full);
        if (fs.existsSync(full)) emptyDir(full);
      } else {
        fs.rmSync(full, { force: true });
      }
    } catch (error) {
      const code =
        error && typeof error === 'object' && 'code' in error
          ? error.code
          : undefined;
      if (code !== 'EPERM' && code !== 'EACCES') throw error;
    }
  }
}

/** @param {string} p */
function mkdir(p) {
  fs.mkdirSync(p, { recursive: true });
}

/**
 * @param {string} raw
 * @returns {{ front: Record<string, unknown>, body: string } | null}
 */
function parseFrontmatter(raw) {
  const trimmed = raw.replace(/^\uFEFF/, '').replace(/^\s+/, '');
  if (!trimmed.startsWith('---')) return null;
  const end = trimmed.indexOf('\n---', 3);
  if (end === -1) return null;
  const yamlBlock = trimmed.slice(3, end).trim();
  const body = trimmed.slice(end + 4).replace(/^\r?\n/, '');
  let front = {};
  try {
    front = yamlBlock ? YAML.parse(yamlBlock) ?? {} : {};
  } catch {
    front = {};
  }
  if (typeof front !== 'object' || front === null) front = {};
  return { front, body };
}

/** @param {string} d */
function normalizeHexoDate(d) {
  if (d == null || typeof d !== 'string') return undefined;
  const s = d.trim();
  const m = s.match(
    /^(\d{4}-\d{2}-\d{2})(?:[ T](\d{2}:\d{2}:\d{2}))?/
  );
  if (!m) return s;
  const date = m[1];
  const time = m[2] ?? '00:00:00';
  return `${date}T${time}+08:00`;
}

/** @param {string} title */
function titleLooksWeak(title) {
  if (!title || typeof title !== 'string') return true;
  const t = title.trim();
  if (t.length < 2) return true;
  if (/^index$/i.test(t)) return true;
  if (/^[a-z]{1,6}$/i.test(t) && t.length <= 6) return true;
  return false;
}

/** @param {string} body */
function firstH1(body) {
  const m = body.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : '';
}

/** @param {string} body */
function extractDescription(body) {
  const lines = body.split(/\r?\n/);
  const buf = [];
  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;
    if (t.startsWith('```')) continue;
    if (t.startsWith('#')) continue;
    if (t.startsWith('>')) continue;
    if (t.startsWith('|')) continue;
    if (/^[-*]\s/.test(t)) continue;
    if (/^\d+\.\s/.test(t)) continue;
    if (t.startsWith('![')) continue;
    if (/^https?:\/\//i.test(t)) continue;
    if (/^\[[^\]]+\]\([^)]+\)$/.test(t) && /^https?:/i.test(t)) continue;
    const text = t
      .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
      .replace(/\[[^\]]+\]\([^)]+\)/g, '$1')
      .replace(/`[^`]+`/g, '')
      .trim();
    if (text.length > 20) {
      buf.push(text);
      if (buf.join(' ').length > 140) break;
    }
  }
  let out = buf.join(' ').replace(/\s+/g, ' ').trim();
  if (out.length > 200) out = out.slice(0, 197) + '…';
  return out || undefined;
}

/** @param {string} name */
function slugFromFilename(name) {
  const base = path.basename(name, '.md');
  return base
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\u4e00-\u9fff-]/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'post';
}

/**
 * @param {string} url
 * @returns {boolean}
 */
function looksLikeLocalAsset(url) {
  const u = url.split('?')[0].split('#')[0];
  if (!u || u.startsWith('//') || /^https?:/i.test(u)) return false;
  if (u.startsWith('mailto:') || u.startsWith('data:')) return false;
  if (!u.includes('.') && !u.includes('/')) return false;
  const ext = path.extname(u).toLowerCase();
  const assetExts = new Set([
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.webp',
    '.svg',
    '.pdf',
    '.zip',
    '.ico',
    '.bmp',
    '.mp4',
    '.webm',
  ]);
  if (assetExts.has(ext)) return true;
  if (!ext && /\/[^/]+\/[^/]+/.test(u)) return true;
  return /\.(png|jpe?g|gif|webp|svg|pdf)$/i.test(u);
}

/**
 * Strip Hexo-style static paths to Astro routes.
 * @param {string} pathname path only, no query
 */
function stripHtmlRoute(pathname) {
  let p = pathname.replace(/\/index\.html?$/i, '').replace(/\.html?$/i, '');
  if (p === '') p = '/';
  return p;
}

/**
 * @param {string} rawUrl
 * @param {{ fileDir: string }} ctx fileDir is posix relative to source/ (no leading slash)
 */
function normalizeInternalUrl(rawUrl, ctx) {
  const { fileDir } = ctx;
  let raw = rawUrl.trim();
  if (!raw || raw.startsWith('#')) return raw;

  let pathPart = raw;
  let suffix = '';
  const q = pathPart.indexOf('?');
  const h = pathPart.indexOf('#');
  if (h >= 0) {
    suffix = pathPart.slice(h);
    pathPart = pathPart.slice(0, h);
  }
  if (q >= 0 && (h < 0 || q < h)) {
    suffix = pathPart.slice(q) + suffix;
    pathPart = pathPart.slice(0, q);
  }

  const decoded = (() => {
    try {
      return decodeURIComponent(pathPart);
    } catch {
      return pathPart;
    }
  })();

  if (/^https?:\/\//i.test(decoded) || decoded.startsWith('//'))
    return rawUrl;
  if (decoded.startsWith('mailto:') || decoded.startsWith('data:'))
    return rawUrl;

  const posixDir = fileDir.split(path.sep).join('/');
  let resolved;
  if (decoded.startsWith('/')) {
    resolved = decoded.slice(1);
  } else {
    const dir = posixDir || '';
    const joined = path.posix.normalize(path.posix.join(dir, decoded));
    resolved = joined.replace(/^\.\//, '');
  }

  const routePath = '/' + stripHtmlRoute('/' + resolved).replace(/^\//, '');
  const clean =
    routePath === '/' ? '/' : routePath.replace(/\/$/, '') || '/';

  if (looksLikeLocalAsset(decoded) || looksLikeLocalAsset(pathPart)) {
    const abs = pathPart.startsWith('/') ? pathPart : '/' + resolved;
    return abs.split('?')[0].split('#')[0] + suffix;
  }

  if (/\.html?$/i.test(resolved) || /\/index\.html?$/i.test(resolved))
    return clean + suffix;

  if (
    resolved.endsWith('.md') ||
    resolved.includes('.md/') ||
    /\.md$/i.test(decoded)
  ) {
    const withoutMd = resolved.replace(/\.md$/i, '');
    return '/' + stripHtmlRoute('/' + withoutMd).replace(/^\//, '') + suffix;
  }

  if (pathPart.startsWith('/')) {
    if (looksLikeLocalAsset(pathPart)) {
      const abs = '/' + resolved.split('?')[0].replace(/^\//, '');
      return abs + suffix;
    }
    return clean + suffix;
  }

  if (looksLikeLocalAsset(decoded)) {
    return '/' + resolved.split('?')[0] + suffix;
  }

  return rawUrl;
}

/** @param {string} body @param {{ fileDir: string }} ctx */
function rewriteMarkdownUrls(body, ctx) {
  return body.replace(
    /(!?\[[^\]]*\])\(([^)]+)\)/g,
    (_all, pre, url) => {
      const trimmed = url.trim();
      const parts = trimmed.split(/\s+/);
      const target = parts[0];
      const rest = parts.slice(1).join(' ');
      const n = normalizeInternalUrl(target, ctx);
      return rest ? `${pre}(${n} ${rest})` : `${pre}(${n})`;
    }
  );
}

/** @param {string} body */
function convertMathLikeFences(body) {
  const lines = body.split(/\r?\n/);
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (/^```\s*$/.test(line.trim())) {
      const start = i;
      i++;
      const chunk = [];
      while (i < lines.length && !/^```\s*$/.test(lines[i].trim())) {
        chunk.push(lines[i]);
        i++;
      }
      const closed = i < lines.length && /^```\s*$/.test(lines[i].trim());
      if (closed) i++;

      const inner = chunk.join('\n');
      if (closed && shouldConvertToAlignedMath(inner)) {
        const tex = fenceToAligned(inner);
        out.push('$$');
        out.push(tex);
        out.push('$$');
      } else {
        out.push(lines[start]);
        out.push(...chunk);
        if (closed) out.push('```');
      }
    } else {
      out.push(line);
      i++;
    }
  }
  return out.join('\n');
}

/** @param {string} inner */
function shouldConvertToAlignedMath(inner) {
  const lines = inner.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return false;
  const blockers =
    /GPU|Step|Tree|Ring|arrow|-->|<--|┌|└|├|│|\+--|\| |\^\s*$/i;
  if (blockers.test(inner)) return false;
  let eqLines = 0;
  for (const l of lines) {
    const t = l.trim();
    if (!t) continue;
    if (!/=/.test(t)) return false;
    if (!/^[\s0-9a-zA-Z^_*+\-=/\\,.(){}[\]|'`]+$/.test(t)) return false;
    eqLines++;
  }
  return eqLines >= 2;
}

/** @param {string} inner */
function fenceToAligned(inner) {
  const lines = inner.split(/\r?\n/).filter((l) => l.trim());
  const parts = lines.map((l, idx) => {
    const t = l.trim();
    const m = t.match(/^(.+?)=(.+)$/);
    if (!m) return t;
    const lhs = m[1].trim();
    const rhs = m[2].trim();
    if (idx === 0) return `${lhs} &= ${rhs}`;
    return `&= ${rhs}`;
  });
  return `\\begin{aligned}\n${parts.join(' \\\\\n')}\n\\end{aligned}`;
}

/** @param {string} relSource posix path under source/ */
function pageOutputPath(relSource) {
  const noExt = relSource.replace(/\.md$/i, '');
  const parts = noExt.split('/');
  if (parts[parts.length - 1] === 'index') parts.pop();
  const rel = parts.join('/');
  return rel ? `${rel}.md` : 'index.md';
}

/** @param {string} dir */
function collectMarkdownFiles(dir, base = '') {
  /** @type {string[]} */
  const acc = [];
  if (!fs.existsSync(dir)) return acc;
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    if (name.name.startsWith('.')) continue;
    const rel = base ? `${base}/${name.name}` : name.name;
    const full = path.join(dir, name.name);
    if (name.isDirectory()) acc.push(...collectMarkdownFiles(full, rel));
    else if (name.name.endsWith('.md')) acc.push(rel.split(path.sep).join('/'));
  }
  return acc;
}

function copyStaticAssets() {
  mkdir(PUBLIC);
  emptyDir(PUBLIC);

  function walk(dir, relBase) {
    for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
      if (SKIP_COPY_NAMES.has(name.name)) continue;
      const full = path.join(dir, name.name);
      const rel = relBase ? `${relBase}/${name.name}` : name.name;
      const posixRel = rel.split(path.sep).join('/');
      if (name.isDirectory()) {
        walk(full, rel);
        continue;
      }
      const lower = name.name.toLowerCase();
      if (lower.endsWith('.md') || lower.endsWith('.html')) continue;
      if (name.name === 'CNAME') {
        fs.copyFileSync(full, path.join(PUBLIC, 'CNAME'));
        continue;
      }
      const dest = path.join(PUBLIC, posixRel);
      mkdir(path.dirname(dest));
      fs.copyFileSync(full, dest);
    }
  }

  walk(SOURCE, '');
}

/** @param {Record<string, unknown>} front @param {string} body @param {boolean} isBlog */
function buildYamlFront(front, body, isBlog) {
  /** @type {Record<string, unknown>} */
  const out = {};
  const titleRaw = front.title;
  let title =
    typeof titleRaw === 'string' ? titleRaw.trim() : String(titleRaw ?? '');
  if (titleLooksWeak(title)) {
    const h1 = firstH1(body);
    if (h1) title = h1;
  }
  out.title = title || 'Untitled';

  if (front.description && typeof front.description === 'string')
    out.description = front.description.trim();
  else {
    const d = extractDescription(body);
    if (d) out.description = d;
  }

  const dateVal = front.pubDate ?? front.date;
  if (isBlog) {
    const pd = normalizeHexoDate(
      typeof dateVal === 'string' || typeof dateVal === 'number'
        ? String(dateVal)
        : ''
    );
    if (!pd) throw new Error(`Blog post missing date: ${out.title}`);
    out.pubDate = pd;
  } else if (dateVal != null) {
    const pd = normalizeHexoDate(String(dateVal));
    if (pd) out.pubDate = pd;
  }

  if (front.category != null) out.category = front.category;
  if (Array.isArray(front.tags)) out.tags = front.tags;
  else if (typeof front.tags === 'string') out.tags = [front.tags];

  const hero = front.heroImage ?? front.thumbnail;
  if (typeof hero === 'string' && hero.trim()) out.heroImage = hero.trim();

  const lines = ['---'];
  for (const [k, v] of Object.entries(out)) {
    if (v === undefined) continue;
    if (k === 'tags' && Array.isArray(v)) {
      lines.push(`${k}:`);
      for (const t of v) lines.push(`  - ${JSON.stringify(String(t))}`);
    } else if (v instanceof Date) {
      lines.push(`${k}: ${v.toISOString()}`);
    } else if (typeof v === 'string') {
      lines.push(`${k}: ${JSON.stringify(v)}`);
    } else {
      lines.push(`${k}: ${JSON.stringify(v)}`);
    }
  }
  lines.push('---');
  return lines.join('\n') + '\n';
}

function generateLinksTs() {
  const ymlPath = path.join(SOURCE, '_data', 'links.yml');
  mkdir(OUT_DATA);
  if (!fs.existsSync(ymlPath)) {
    fs.writeFileSync(
      path.join(OUT_DATA, 'links.ts'),
      'export const cardLinks: { title: string; link: string; avatar: string; descr: string }[] = [];\n',
      'utf8'
    );
    return;
  }
  const raw = fs.readFileSync(ymlPath, 'utf8');
  let doc;
  try {
    doc = YAML.parse(raw);
  } catch {
    doc = {};
  }
  /** @type { { title: string; link: string; avatar: string; descr: string }[] } */
  const cards = [];
  if (doc && typeof doc === 'object') {
    for (const [title, val] of Object.entries(doc)) {
      if (title.startsWith('#') || val == null) continue;
      if (typeof val === 'object' && val !== null && 'link' in val) {
        const o = /** @type {{ link?: string; avatar?: string; descr?: string }} */ (
          val
        );
        let link = String(o.link ?? '').trim();
        link = normalizeInternalUrl(link, { fileDir: '' });
        if (link.startsWith('/')) {
          /* ok */
        } else if (!/^https?:/i.test(link)) {
          link = '/' + link;
        }
        cards.push({
          title: String(title).trim(),
          link,
          avatar: String(o.avatar ?? '').trim(),
          descr: String(o.descr ?? '').trim(),
        });
      }
    }
  }
  const ts =
    `export const cardLinks = ${JSON.stringify(cards, null, 2)} as const;\n` +
    `export type CardLink = (typeof cardLinks)[number];\n`;
  fs.writeFileSync(path.join(OUT_DATA, 'links.ts'), ts, 'utf8');
}

function main() {
  mkdir(path.join(ROOT, 'src', 'content'));
  mkdir(OUT_BLOG);
  mkdir(OUT_PAGES);
  emptyDir(OUT_BLOG);
  emptyDir(OUT_PAGES);

  copyStaticAssets();
  generateLinksTs();

  const postsDir = path.join(SOURCE, '_posts');
  if (fs.existsSync(postsDir)) {
    for (const name of fs.readdirSync(postsDir)) {
      if (!name.endsWith('.md')) continue;
      const full = path.join(postsDir, name);
      const raw = fs.readFileSync(full, 'utf8');
      const parsed = parseFrontmatter(raw);
      let body;
      /** @type {Record<string, unknown>} */
      let front = {};
      if (parsed) {
        front = parsed.front;
        body = parsed.body;
      } else {
        body = raw;
      }
      const slug = slugFromFilename(name);
      body = convertMathLikeFences(body);
      body = rewriteMarkdownUrls(body, { fileDir: '_posts' });
      const yaml = buildYamlFront(front, body, true);
      const outFile = path.join(OUT_BLOG, `${slug}.md`);
      fs.writeFileSync(outFile, yaml + body, 'utf8');
    }
  }

  const allMd = collectMarkdownFiles(SOURCE);
  for (const rel of allMd) {
    if (rel.startsWith('_posts/') || rel.startsWith('_data/')) continue;
    const full = path.join(SOURCE, ...rel.split('/'));
    const raw = fs.readFileSync(full, 'utf8');
    const parsed = parseFrontmatter(raw);
    let body;
    /** @type {Record<string, unknown>} */
    let front = {};
    if (parsed) {
      front = parsed.front;
      body = parsed.body;
    } else {
      body = raw;
    }
    const fileDir = path.posix.dirname(rel);
    body = convertMathLikeFences(body);
    body = rewriteMarkdownUrls(body, { fileDir });
    const yaml = buildYamlFront(front, body, false);
    const outRel = pageOutputPath(rel);
    const outPath = path.join(OUT_PAGES, ...outRel.split('/'));
    mkdir(path.dirname(outPath));
    fs.writeFileSync(outPath, yaml + body, 'utf8');
  }

  console.log('sync-legacy-content: blog + pages + public + links.ts regenerated');
}

main();
