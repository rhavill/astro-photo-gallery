import { defineCollection, reference, z } from 'astro:content';
import { file } from 'astro/loaders';

// const folders = defineCollection({
//   loader: file("./src/album/folders.json"),
// });
const folders = defineCollection({
  loader: async () => {
    const modules = await import.meta.glob('./album/**/*', { eager: true });
    const folders = Object.keys(modules).map(
      path => {
        const matches = path.match(/^\.\/album\/([^\/]+)/)
        return {
          id: matches[1],
          displayName: matches[1].split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1) ).join(" "),
        };
      }
    );
    console.log({modules, folders})
    return folders;
  },
  schema: z.object({
    id: z.string(),
    displayName: z.string(),
  }),
});

// const photos = defineCollection({
//   loader: glob({
//     pattern: "**/*",
//     base: "./src/album"
//   }),
//   schema: z.object({
//     name: z.string(),
//   }),
// });
const photos = defineCollection({
  loader: async () => {
    // const relativeBasePath = '../assets/';
    const modules = await import.meta.glob('./album/**/*', { eager: true });
    const photos = Object.keys(modules).map(
      path => {
        const matches = path.match(/^\.\/album\/([^\/]+)/)
        return { id: path, folder: matches[1] };
      }
    );
    console.log({modules, photos})
    // console.log('modules', modules)
      // const response = await fetch("https://restphotos.com/v3.1/all");
    // const data = await response.json();
    // // Must return an array of entries with an id property, or an object with IDs as keys and entries as values
    // return data.map((country) => ({
    //   id: country.cca3,
    //   ...country,
    // }));
    return photos;
  },
  schema: z.object({
    id: z.string(),
    folder: reference('folders'),
  })
});
export const collections = { folders, photos };