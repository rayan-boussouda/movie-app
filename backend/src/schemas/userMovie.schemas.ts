import z from 'zod';
import { idParamSchema } from './common.schemas';

const watchStatusEnum = z.enum(['WATCHLIST', 'WATCHED', 'FAVORITE']);

export const addMovieSchema = z.object({
  body: z.object({
    movieId: z.number().int().positive(),
    status: watchStatusEnum,
  }),
});

export const updateStatusSchema = z.object({
  params: idParamSchema.shape.params,
  body: z.object({
    status: watchStatusEnum,
  }),
});

export const getUserMoviesSchema = z.object({
  query: z.object({
    status: watchStatusEnum.optional(),
  }),
});

export type AddMovieSchema = z.infer<typeof addMovieSchema>['body'];
export type UpdateStatusSchema = z.infer<typeof updateStatusSchema>['body'];
export type GetUserMoviesSchema = z.infer<typeof getUserMoviesSchema>['query'];
