import type { Genre } from "./genre";

export type GenreGateway = {
  getAll: () => Promise<Genre[]>;
};
