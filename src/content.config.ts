import { defineCollection, reference, z } from 'astro:content';

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

const photos= defineCollection({
  loader: async () => {
    const images = await import.meta.glob('./album/**/*', { eager: true });
    const photos = Object.keys(images).map(path => {
      const matches = path.match(/^\.\/album\/([^\/]+)/);
      return {
        id: path,
        album: matches[1],
        ...images[path].default,
      };
    });
    // console.log('photos',photos)
    return photos;
  },
  schema: z.object({
    id: z.string(),
    album: reference("albums"),
    src: z.string(),
    width: z.number(),
    height: z.number(),
    format: z.string(),
  }),
});

export const collections = { albums, photos };
