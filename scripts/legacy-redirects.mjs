import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

// Match the retired Hexo :year/:month/:day/:title/ permalink scheme.
export function legacyRedirects() {
  const directory = new URL('../source/_posts/', import.meta.url);
  const redirects = {};
  for (const filename of fs.readdirSync(directory)) {
    if (!filename.endsWith('.md')) continue;
    const raw = fs.readFileSync(new URL(filename, directory), 'utf8');
    const match = raw.match(/^\uFEFF?\s*---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) throw new Error(`Missing frontmatter: ${filename}`);
    const front = YAML.parse(match[1]);
    const date = String(front.date ?? front.pubDate).match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!date) throw new Error(`Missing legacy date: ${filename}`);
    const basename = path.basename(filename, '.md');
    const oldSlug = String(front.slug ?? basename).replace(/\s+/g, '-');
    const newSlug = basename.trim().toLowerCase().replace(/\s+/g, '-')
      .replace(/[^a-z0-9\u4e00-\u9fff-]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'post';
    redirects[`/${date[1]}/${date[2]}/${date[3]}/${oldSlug}/`] = `/blog/${newSlug}/`;
  }
  return redirects;
}
