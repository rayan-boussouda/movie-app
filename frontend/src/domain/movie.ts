import z from 'zod'
import { genreSchema } from '@/domain/genre'

export const movieSchema = z.object({
  id: z.number(),
  title: z.string(),
  synopsis: z.string(),
  posterUrl: z.string().nullable(),
  releaseYear: z.string(),
  genres: z.array(genreSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Movie = z.infer<typeof movieSchema>

export const paginatedMoviesSchema = z.object({
  movies: z.array(movieSchema),
  total: z.number(),
  totalPages: z.number(),
  hasNext: z.boolean(),
})

export type PaginatedMovies = z.infer<typeof paginatedMoviesSchema>

export const getMoviesByPageParamsSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(20),
  sortBy: z.enum(['title', 'releaseYear']).default('title'),
  order: z.enum(['asc', 'desc']).default('asc'),
  genreId: z.number().int().positive().optional(),
})

export type GetMoviesByPageParams = z.infer<typeof getMoviesByPageParamsSchema>
