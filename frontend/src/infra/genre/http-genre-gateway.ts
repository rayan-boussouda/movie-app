import z from "zod";
import type { GenreGateway } from "@/domain/genre.port";
import { httpClient } from "@/infra/http-client";
import {
  genreSchema,
  type CreateGenre,
  type UpdateGenre,
} from "@/domain/genre";

export const httpGenreGateway: GenreGateway = {
  getAll: async () => {
    const response = await httpClient.get("/genres");
    return z.array(genreSchema).parse(response.data);
  },
  getById: async (id: number) => {
    const response = await httpClient.get(`/genres/${id}`);
    return genreSchema.parse(response.data);
  },
  createGenre: async (genre: CreateGenre) => {
    const response = await httpClient.post("/genres", genre);
    return genreSchema.parse(response.data);
  },
  updateGenre: async (id: number, genre: UpdateGenre) => {
    const response = await httpClient.patch(`/genres/${id}`, genre);
    return genreSchema.parse(response.data);
  },
  deleteGenre: async (id: number) => {
    await httpClient.delete(`/genres/${id}`);
  },
};
