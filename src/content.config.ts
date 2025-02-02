import { defineCollection, reference, z } from 'astro:content';

const albums = defineCollection({
  loader: async () => {
    const modules = await import.meta.glob('./album/**/*', { eager: true });
    const albums = Object.keys(modules).map(
      path => {
        const matches = path.match(/^\.\/album\/([^\/]+)/)
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
    // const resolvedImages = await Promise.all(
    //   Object.values(images).map((image) => image().then((mod) => mod.default))
    // );
    const photos = Object.keys(images).map(key => ({
      id: key,
      ...images[key].default,
    }));
    // console.log({photos})
    return photos;
  },
  // schema: z.object({
  //   id: z.string(),
  //   displayName: z.string(),
  // }),
});

export const collections = { albums, photos };
