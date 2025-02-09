import { defineCollection, z } from 'astro:content';

const albums = defineCollection({
  loader: async () => {
    const modules = await import.meta.glob('./album/**/*', { eager: true });
    const albums = Object.keys(modules).map(
      path => {
        const matches = path.match(/^\.\/album\/([^\/]+)/);
        return {
          id: matches[1],
          displayName: matches[1].split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1) ).join(" "),
        };
      }
    );
    return albums;
  },
  schema: z.object({
    id: z.string(),
    displayName: z.string(),
  }),
});

export const collections = { albums };
