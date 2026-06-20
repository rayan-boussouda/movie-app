import type { CreateGenre, Genre, UpdateGenre } from "./genre";

export type GenreGateway = {
  getAll: () => Promise<Genre[]>;
  getById: (id: number) => Promise<Genre>;
  createGenre: (genre: CreateGenre) => Promise<Genre>;
  updateGenre: (id: number, genre: UpdateGenre) => Promise<Genre>;
  deleteGenre: (id: number) => Promise<void>;
};
