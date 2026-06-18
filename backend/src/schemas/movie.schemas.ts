import z from 'zod';
import { paginationSchema } from './common.schemas';

export const createMovieSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(100),
    synopsis: z.string().min(3).max(1000),
    posterUrl: z.url().optional(),
    releaseYear: z.iso.date(),
    genres: z
      .array(z.object({ genreId: z.number().int().positive() }))
      .optional(),
  }),
});

export const updateMovieSchema = z.object({
  body: createMovieSchema.shape.body.partial(),
});

export const searchMovieSchema = z.object({
  query: z.object({
    title: z.string().min(1),
  }),
});

export const getMoviesByPageSchema = z.object({
  query: paginationSchema.extend({
    genreId: z.coerce.number().int().positive().optional(),
    sortBy: z.enum(['title', 'releaseYear']).optional().default('title'),
    order: z.enum(['asc', 'desc']).optional().default('asc'),
  }),
});

export type SearchMovieSchema = z.infer<typeof searchMovieSchema>['query'];
export type UpdateMovieSchema = z.infer<typeof updateMovieSchema>['body'];
export type CreateMovieSchema = z.infer<typeof createMovieSchema>['body'];
export type GetMoviesByPageSchema = z.infer<
  typeof getMoviesByPageSchema
>['query'];
