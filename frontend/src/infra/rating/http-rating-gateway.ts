import type { RatingGateway } from "@/domain/rating.port";
import { httpClient } from "../http-client";
import { ratingSchema, type CreateRatingPayload, type UpdateRatingPayload } from "@/domain/rating";

export const httpRatingGateway: RatingGateway = {
  createRating: async (data: CreateRatingPayload) => {
    const response = await httpClient.post(`/ratings`, data);
    return ratingSchema.parse(response.data);
  },
  updateRating: async (id: number, data: UpdateRatingPayload) => {
    const response = await httpClient.patch(`/ratings/${id}`, data);
    return ratingSchema.parse(response.data);
  },
};
