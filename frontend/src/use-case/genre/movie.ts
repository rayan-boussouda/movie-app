import type { GetMoviesByPageParams } from "@/domain/movie";
import type { MovieGateway } from "@/domain/movie.port";

export const buildGetMovies =
  (movieGateway: MovieGateway) => async (params: GetMoviesByPageParams) => {
    const movies = await movieGateway.getMovies(params);
    return movies;
  };
