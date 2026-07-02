import type {
  CreateMovie,
  GetMoviesByPageParams,
  Movie,
  PaginatedMovies,
  UpdateMovie,
} from "./movie";

export type MovieGateway = {
  getMovies: (params: GetMoviesByPageParams) => Promise<PaginatedMovies>;
  createMovie: (body: CreateMovie) => Promise<Movie>;
  updateMovie: (id: number, body: UpdateMovie) => Promise<Movie>;
  uploadMoviePicture: (id: number, file: File) => Promise<string>;
  deletMovie: (movieId: number) => void;
};
