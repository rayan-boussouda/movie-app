import type { RatingGateway } from "@/domain/rating.port";
import { buildCreateRating, buildUpdateRating } from "@/use-case/rating/rating";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateRating = (ratingGateway: RatingGateway) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: buildCreateRating(ratingGateway),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["getMovies"] }),
  });
};

export const useUpdateRating = (ratingGateway: RatingGateway) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: buildUpdateRating(ratingGateway),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["getMovies"] }),
  });
};
