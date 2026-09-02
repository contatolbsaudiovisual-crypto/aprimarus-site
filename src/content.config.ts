import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/[^_.]*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    resumo: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('Leonardo Di Bartolomeo'),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    faq: z
      .array(
        z.object({
          pergunta: z.string(),
          resposta: z.string(),
        })
      )
      .optional(),
  }),
});

export const collections = { blog };
