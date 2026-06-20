// domain/genre.ts
import { z } from "zod";

export const genreSchema = z.object({
  id: z.number(),
  name: z.string(),
});
export type Genre = z.infer<typeof genreSchema>;

export const createGenreSchema = genreSchema.omit({ id: true });
export type CreateGenre = z.infer<typeof createGenreSchema>;

export const updateGenreSchema = createGenreSchema.partial();
export type UpdateGenre = z.infer<typeof updateGenreSchema>;
