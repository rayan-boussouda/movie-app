import { z } from 'zod';

export const createPostSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(100),
    content: z.string().min(3).max(300),
    tags: z.array(z.object({ tagId: z.number().int().positive() })).optional(),
  }),
});
export type CreatePostInput = z.infer<typeof createPostSchema>['body'];

export const getPostsPaginatedSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    size: z.coerce.number().int().positive().max(100).default(10),
  }),
});

export type GetPostsPaginatedInput = z.infer<
  typeof getPostsPaginatedSchema
>['query'];
