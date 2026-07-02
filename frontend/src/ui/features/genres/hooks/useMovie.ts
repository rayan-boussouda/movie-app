import type { GetMoviesByPageParams } from "@/domain/movie";
import type { MovieGateway } from "@/domain/movie.port";
import {
  buildCreateMovie,
  buildDeleteMovie,
  buildGetMovies,
  buildUpdateMovie,
  builUploadMoviePicture,
} from "@/use-case/genre/movie";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetMovies = (
  params: GetMoviesByPageParams,
  movieGateway: MovieGateway,
) => {
  return useQuery({
    queryKey: ["getMovies", params],
    queryFn: () => buildGetMovies(movieGateway)(params),
  });
};

export const useCreateMovie = (movieGateway: MovieGateway) => {
  return useMutation({
    mutationFn: buildCreateMovie(movieGateway),
  });
};

export const useUploadMoviePicture = (movieGateway: MovieGateway) => {
  return useMutation({
    mutationFn: builUploadMoviePicture(movieGateway),
  });
};

export const useUpdateMovie = (movieGateway: MovieGateway) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: buildUpdateMovie(movieGateway),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["getMovies"] }),
  });
};

export const useDeleteMovie = (movieGateway: MovieGateway) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: buildDeleteMovie(movieGateway),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["getMovies"] }),
  });
};
