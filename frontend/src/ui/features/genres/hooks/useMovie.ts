import type { GetMoviesByPageParams } from "@/domain/movie";
import type { MovieGateway } from "@/domain/movie.port";
import { buildGetMovies } from "@/use-case/genre/movie";
import { useQuery } from "@tanstack/react-query";

export const useGetMovies = (
  params: GetMoviesByPageParams,
  movieGateway: MovieGateway,
) => {
  return useQuery({
    queryKey: ["getMovies", params],
    queryFn: () => buildGetMovies(movieGateway)(params),
  });
};
