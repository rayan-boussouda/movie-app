import { useQuery } from "@tanstack/react-query";
import {
  buildGetAllGenres,
  buildGetGenreById,
} from "../../../../use-case/genre/get-all-genre";
import type { GenreGateway } from "../../../../domain/genre.port";

export const useGetGenre = (gateway: GenreGateway) => {
  return useQuery({
    queryKey: ["getGenre"],
    queryFn: buildGetAllGenres(gateway),
  });
};

export const useGetGenreById = (id: number, gateway: GenreGateway) => {
  return useQuery({
    queryKey: ["getGenreById"],
    queryFn: () => buildGetGenreById(gateway)(id),
  });
};
