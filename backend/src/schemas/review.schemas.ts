import z from 'zod';
import { idParamSchema } from './common.schemas';

export const createReviewSchema = z.object({
  body: z.object({
    movieId: z.number().int().positive(),
    content: z.string().min(3).max(2000),
  }),
});

export const updateReviewSchema = z.object({
  params: idParamSchema.shape.params,
  body: z.object({
    content: z.string().min(3).max(2000),
  }),
});

export const getMovieReviewsSchema = z.object({
  query: z.object({
    movieId: z.coerce.number().int().positive(),
  }),
});

export type CreateReviewSchema = z.infer<typeof createReviewSchema>['body'];
export type UpdateReviewSchema = z.infer<typeof updateReviewSchema>['body'];
export type GetMovieReviewsSchema = z.infer<
  typeof getMovieReviewsSchema
>['query'];
