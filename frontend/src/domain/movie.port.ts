import type { GetMoviesByPageParams, PaginatedMovies } from "./movie";

export type MovieGateway = {
  getMovies: (params: GetMoviesByPageParams) => Promise<PaginatedMovies>;
};
