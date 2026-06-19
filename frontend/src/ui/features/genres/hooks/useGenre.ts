import { useQuery } from "@tanstack/react-query";
import { buildGetAllGenres } from "../../../../use-case/genre/get-all-genre";
import type { GenreGateway } from "../../../../domain/genre.port";

export const useGetGenre = (gateway: GenreGateway) => {
  return useQuery({
    queryKey: ["getGenre"],
    queryFn: buildGetAllGenres(gateway),
  });
};
