import type { MovieGateway } from "@/domain/movie.port";
import { httpClient } from "../http-client";
import {
  movieSchema,
  paginatedMoviesSchema,
  type CreateMovie,
  type GetMoviesByPageParams,
} from "@/domain/movie";

export const httpMoviesGateway: MovieGateway = {
  getMovies: async (params: GetMoviesByPageParams) => {
    const response = await httpClient.get("/movies", { params });
    return paginatedMoviesSchema.parse(response.data);
  },
  createMovie: async (movie: CreateMovie) => {
    const response = await httpClient.post("/movies", movie);
    return movieSchema.parse(response.data);
  },
  uploadMoviePicture: async (id: number, file: File) => {
    const formData = new FormData();
    formData.append("poster", file);

    const { data } = await httpClient.patch(`/movies/${id}/poster`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return data;
  },
  deletMovie: async (id: number) => {
    await httpClient.delete(`/movies/${id}`);
  },
};
