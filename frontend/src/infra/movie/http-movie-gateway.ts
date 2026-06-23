import type { MovieGateway } from "@/domain/movie.port";
import { httpClient } from "../http-client";
import {
  paginatedMoviesSchema,
  type GetMoviesByPageParams,
} from "@/domain/movie";

export const httpMoviesGateway: MovieGateway = {
  getMovies: async (params: GetMoviesByPageParams) => {
    const response = await httpClient.get("/movies", { params });
    return paginatedMoviesSchema.parse(response.data);
  },
};
