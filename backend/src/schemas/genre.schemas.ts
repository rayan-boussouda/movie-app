import z from 'zod';
import { idParamSchema } from './common.schemas';

export const createGenreSchema = z.object({
  body: z.object({ name: z.string().min(2).max(50) }),
});

export const updateGenreSchema = z.object({
  params: idParamSchema.shape.params,
  body: z.object({ name: z.string().min(2).max(50) }),
});

export type CreateGenreSchema = z.infer<typeof createGenreSchema>['body'];
export type UpdateGenreSchema = z.infer<typeof updateGenreSchema>['body'];
