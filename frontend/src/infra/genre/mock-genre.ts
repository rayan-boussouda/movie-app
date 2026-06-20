import type { GenreGateway } from "../../domain/genre.port";

export const mockGenreGateway: GenreGateway = {
  getAll: async () => [{ id: 1, name: "Drama" }],
  getById: async (id: number) => ({ id, name: "Drama" }),
};
