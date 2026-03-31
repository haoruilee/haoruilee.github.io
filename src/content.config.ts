import { defineCollection, z } from 'astro:content';

const blogSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  pubDate: z.coerce.date(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  heroImage: z.string().optional(),
});

const pagesSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  pubDate: z.coerce.date().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  heroImage: z.string().optional(),
});

const blog = defineCollection({ type: 'content', schema: blogSchema });
const pages = defineCollection({ type: 'content', schema: pagesSchema });

export const collections = { blog, pages };
