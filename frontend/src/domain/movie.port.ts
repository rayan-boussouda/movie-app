import type {
  CreateMovie,
  GetMoviesByPageParams,
  Movie,
  PaginatedMovies,
} from "./movie";

export type MovieGateway = {
  getMovies: (params: GetMoviesByPageParams) => Promise<PaginatedMovies>;
  createMovie: (body: CreateMovie) => Promise<Movie>;
  uploadMoviePicture: (id: number, file: File) => Promise<string>;
  deletMovie: (movieId: number) => void;
};
