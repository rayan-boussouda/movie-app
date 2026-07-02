import type { CreateRatingPayload, UpdateRatingPayload } from "@/domain/rating";
import type { RatingGateway } from "@/domain/rating.port";

export const buildCreateRating =
  (ratingGateway: RatingGateway) => async (data: CreateRatingPayload) => {
    return ratingGateway.createRating(data);
  };

export const buildUpdateRating =
  (ratingGateway: RatingGateway) =>
  async ({ id, data }: { id: number; data: UpdateRatingPayload }) => {
    return ratingGateway.updateRating(id, data);
  };
