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

    const photosWithPreviousNextLinks = photos.map((photo, index) => {
      return {
        previousPhotoId:
        index === 0 ? photos[photos.length - 1].id : photos[index - 1].id,
        nextPhotoId:
        index === photos.length - 1 ? photos[0].id : photos[index + 1].id,
        ...photo,
      };
    });

    // console.log('photos',photos)
    return photosWithPreviousNextLinks;
  },
  schema: z.object({
    id: z.string(),
    previousPhotoId: z.string(),
    nextPhotoId: z.string(),
    album: reference("albums"),
    src: z.string(),
    width: z.number(),
    height: z.number(),
    format: z.string(),
  }),
});

export const collections = { albums, photos };
