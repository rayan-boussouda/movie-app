import z from "zod";

export const ratingSchema = z.object({
  id: z.number(),
  userId: z.number(),
  movieId: z.number(),
  value: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const createRatingPayloadSchema = z.object({
  movieId: z.number().int().positive(),
  value: z.number().int().min(1).max(5),
});
export type CreateRatingPayload = z.infer<typeof createRatingPayloadSchema>;

export const updateRatingPayloadSchema = z.object({
  value: z.number().int().min(1).max(5),
});
export type UpdateRatingPayload = z.infer<typeof updateRatingPayloadSchema>;

export type Rating = z.infer<typeof ratingSchema>;

export const embeddedRatingSchema = ratingSchema.pick({
  id: true,
  userId: true,
  value: true,
});

export type EmbeddedRating = z.infer<typeof embeddedRatingSchema>;
