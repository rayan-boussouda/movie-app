import z from "zod";
import type { GenreGateway } from "../../domain/genre.port";
import { httpClient } from "../http-client";
import { genreSchema } from "../../domain/genre";

export const httpGenreGateway: GenreGateway = {
  getAll: async () => {
    const response = await httpClient.get("/genres");
    return z.array(genreSchema).parse(response.data);
  },
  getById: async (id: number) => {
    const response = await httpClient.get(`/genres/${id}`);
    return genreSchema.parse(response.data);
  },
};
