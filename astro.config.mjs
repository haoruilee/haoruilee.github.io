import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { legacyRedirects } from './scripts/legacy-redirects.mjs';

export default defineConfig({
  site: 'https://lihaorui.com',
  redirects: legacyRedirects(),
  vite: {
    cacheDir: '.astro/vite',
  },
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      theme: 'github-light',
    },
  },
});
