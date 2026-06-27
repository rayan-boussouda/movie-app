import z from "zod";
import { genreSchema } from "@/domain/genre";

// ── Response shape (what the API returns) ────────────────────────────────────
export const movieSchema = z.object({
  id: z.number(),
  title: z.string(),
  synopsis: z.string(),
  posterUrl: z.string().nullable(),
  moviePictureUrl: z.string().nullable(),
  releaseYear: z.string(),
  averageRating: z.number(),
  ratingCount: z.number(),
  genres: z.array(genreSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Movie = z.infer<typeof movieSchema>;

export const paginatedMoviesSchema = z.object({
  movies: z.array(movieSchema),
  total: z.number(),
  totalPages: z.number(),
  hasNext: z.boolean(),
});

export type PaginatedMovies = z.infer<typeof paginatedMoviesSchema>;

export const getMoviesByPageParamsSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(20),
  sortBy: z.enum(["title", "releaseYear"]).default("title"),
  order: z.enum(["asc", "desc"]).default("asc"),
  genreId: z.number().int().positive().optional(),
});

export type GetMoviesByPageParams = z.infer<typeof getMoviesByPageParamsSchema>;

// ── Request bodies ────────────────────────────────────────────────────────────
export const createMovieSchema = z.object({
  title: z.string().min(3).max(100),
  synopsis: z.string().min(3).max(1000),
  releaseYear: z.iso.date(),
  posterUrl: z.url().optional(),
  genres: z
    .array(z.object({ genreId: z.number().int().positive() }))
    .optional(),
});

export type CreateMovie = z.infer<typeof createMovieSchema>;

export const updateMovieSchema = createMovieSchema.partial();
export type UpdateMovie = z.infer<typeof updateMovieSchema>;
