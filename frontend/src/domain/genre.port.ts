import type { Genre } from "./genre";

export type GenreGateway = {
  getAll: () => Promise<Genre[]>;
  getById: (id: number) => Promise<Genre>;
};
