import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  buildCreateGenre,
  buildDeleteGenre,
  buildGetAllGenres,
  buildGetGenreById,
  buildUpdateGenre,
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

export const useCreateGenre = (gateway: GenreGateway) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: buildCreateGenre(gateway),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["getGenre"] }),
  });
};

export const useUpdateGenre = (gateway: GenreGateway) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: buildUpdateGenre(gateway),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["getGenre"] }),
  });
};

export const useDeleteGenre = (gateway: GenreGateway) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: buildDeleteGenre(gateway),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["getGenre"] }),
  });
};
