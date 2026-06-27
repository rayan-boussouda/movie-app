import type { CreateMovie, GetMoviesByPageParams } from "@/domain/movie";
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
