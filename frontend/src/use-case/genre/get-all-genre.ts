import type { CreateGenre, Genre, UpdateGenre } from "@/domain/genre";
import type { GenreGateway } from "@/domain/genre.port";

export const buildGetAllGenres =
  (gateway: GenreGateway) => async (): Promise<Genre[]> => {
    const genre = await gateway.getAll();
    return [...genre].sort((a, b) => a.name.localeCompare(b.name));
  };

export const buildGetGenreById =
  (gateway: GenreGateway) =>
  async (id: number): Promise<Genre> => {
    const genre = await gateway.getById(id);
    return genre;
  };

export const buildCreateGenre =
  (gateway: GenreGateway) =>
  async (genreObject: CreateGenre): Promise<Genre> => {
    const genre = await gateway.createGenre(genreObject);
    return genre;
  };

export const buildUpdateGenre =
  (gateway: GenreGateway) =>
  async ({ id, ...data }: { id: number } & UpdateGenre): Promise<Genre> => {
    return gateway.updateGenre(id, data);
  };

export const buildDeleteGenre =
  (gateway: GenreGateway) =>
  async (id: number): Promise<void> => {
    return gateway.deleteGenre(id);
  };
