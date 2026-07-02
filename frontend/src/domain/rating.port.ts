import type { Rating, CreateRatingPayload, UpdateRatingPayload } from "./rating";

export type RatingGateway = {
  createRating: (data: CreateRatingPayload) => Promise<Rating>;
  updateRating: (id: number, data: UpdateRatingPayload) => Promise<Rating>;
};
