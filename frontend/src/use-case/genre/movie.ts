import type { CreateMovie, GetMoviesByPageParams, UpdateMovie } from "@/domain/movie";
import type { MovieGateway } from "@/domain/movie.port";

export const buildGetMovies =
  (movieGateway: MovieGateway) => async (params: GetMoviesByPageParams) => {
    const movies = await movieGateway.getMovies(params);
    return movies;
  };

export const buildCreateMovie =
  (movieGateway: MovieGateway) => async (body: CreateMovie) => {
    const movie = await movieGateway.createMovie(body);
    return movie;
  };
export const builUploadMoviePicture =
  (movieGateway: MovieGateway) =>
  async ({ id, file }: { id: number; file: File }) => {
    const moviePicture = await movieGateway.uploadMoviePicture(id, file);
    return moviePicture;
  };

export const buildUpdateMovie =
  (movieGateway: MovieGateway) =>
  async ({ id, data }: { id: number; data: UpdateMovie }) => {
    const movie = await movieGateway.updateMovie(id, data);
    return movie;
  };

export const buildDeleteMovie =
  (movieGateway: MovieGateway) => async (id: number) => {
    await movieGateway.deletMovie(id);
  };
