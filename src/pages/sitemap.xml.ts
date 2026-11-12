import { getCollection } from 'astro:content';

export async function GET({ site }: { site: URL }) {
  const posts = await getCollection('blog');
  const pages = await getCollection('pages');
  const paths = new Set([
    '/', '/blog/', '/news/', '/projects-publications/',
    ...posts.map(entry => `/blog/${entry.slug}/`),
    ...pages.map(entry => `/${entry.slug.replace(/^\/+|\/+$/g, '')}/`),
  ]);
  const escapeXml = (value: string) => value.replace(/[<>&"']/g, character => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;',
  })[character]!);
  const urls = [...paths].sort().map(path => `<url><loc>${escapeXml(new URL(path, site).href)}</loc></url>`);
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>\n`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
