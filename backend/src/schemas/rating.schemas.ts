import z from 'zod';
import { idParamSchema } from './common.schemas';

export const createRatingSchema = z.object({
  body: z.object({
    movieId: z.number().int().positive(),
    value: z.number().int().min(1).max(5),
  }),
});

export const updateRatingSchema = z.object({
  params: idParamSchema.shape.params,
  body: z.object({
    value: z.number().int().min(1).max(5),
  }),
});

export const getMovieRatingsSchema = z.object({
  query: z.object({
    movieId: z.coerce.number().int().positive(),
  }),
});

export type CreateRatingSchema = z.infer<typeof createRatingSchema>['body'];
export type UpdateRatingSchema = z.infer<typeof updateRatingSchema>['body'];
export type GetMovieRatingsSchema = z.infer<
  typeof getMovieRatingsSchema
>['query'];
