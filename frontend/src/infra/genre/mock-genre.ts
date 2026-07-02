import type { CreateGenre, UpdateGenre } from "@/domain/genre";
import type { GenreGateway } from "@/domain/genre.port";

export const mockGenreGateway: GenreGateway = {
  getAll: async () => [{ id: 1, name: "Drama" }],
  getById: async (id: number) => ({ id, name: "Drama" }),
  createGenre: async (_data: CreateGenre) => ({ id: 1, name: "Drama" }),
  updateGenre: async (id: number, _genre: UpdateGenre) => ({
    id,
    name: "Drama",
  }),
  deleteGenre: async (_id: number) => {},
};
