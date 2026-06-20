import type { Genre } from "../../domain/genre";
import type { GenreGateway } from "../../domain/genre.port";

export const buildGetAllGenres =
  (gateway: GenreGateway) => async (): Promise<Genre[]> => {
    const genre = await gateway.getAll();
    return [...genre].sort((a, b) => a.name.localeCompare(b.name));
  };
