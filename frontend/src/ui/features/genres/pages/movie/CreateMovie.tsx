import { httpMoviesGateway } from "@/infra/movie/http-movie-gateway";
import { useCreateMovie, useUploadMoviePicture } from "../../hooks/useMovie";
import { createMovieSchema, type CreateMovie } from "@/domain/movie";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useGetGenre } from "../../hooks/useGenre";
import { httpGenreGateway } from "@/infra/genre/http-genre-gateway";
import Select from "react-select";
import { toSelectOptions } from "@/utils/toSelectOptions";
import { useState } from "react";
import { builUploadMoviePicture } from "@/use-case/genre/movie";
import { useQueryClient } from "@tanstack/react-query";

export const CreateMovieForm = () => {
  const { mutate: createMovie } = useCreateMovie(httpMoviesGateway);
  const { mutate: uploadMoviePicture } =
    useUploadMoviePicture(httpMoviesGateway);
  const { data: genres } = useGetGenre(httpGenreGateway);
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm<CreateMovie>({
    resolver: zodResolver(createMovieSchema),
    defaultValues: {
      title: "",
      synopsis: "",
      releaseYear: "",
      genres: [],
    },
  });
  const [posterFile, setPosterFile] = useState<File>();
  const queryClient = useQueryClient();

  const onSubmit = (data: CreateMovie) => {
    createMovie(data, {
      onSuccess: (movie) => {
        if (posterFile) {
          uploadMoviePicture(
            { id: movie.id, file: posterFile },
            {
              onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["getMovies"] });
              },
            },
          );
        } else {
          queryClient.invalidateQueries({ queryKey: ["getMovies"] });
        }
      },
    });
  };

  const inputCss =
    "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const inputSelect =
    "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500";
  return (
    <form
      onSubmit={handleSubmit(onSubmit, (errors) =>
        console.log("validation errors", errors),
      )}
    >
      <input
        {...register("title")}
        type="text"
        placeholder="Title"
        className={inputCss}
      />
      {errors.title && <p>{errors.title.message}</p>}
      <input
        {...register("synopsis")}
        type="text"
        placeholder="synopsis"
        className={inputCss}
      />
      {errors.synopsis && <p>{errors.synopsis.message}</p>}
      <input
        {...register("releaseYear")}
        type="date"
        placeholder="release year"
        className={inputCss}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) setPosterFile(file);
        }}
      />

      {errors.releaseYear && <p>{errors.releaseYear.message}</p>}

      <Controller
        control={control}
        name="genres"
        render={({ field }) => {
          const selectedIds = field?.value?.map((g) => g.genreId) ?? [];
          return (
            <Select
              isMulti
              options={toSelectOptions(genres ?? [])}
              value={toSelectOptions(genres ?? []).filter((option) => {
                return selectedIds?.includes(option.value);
              })}
              onChange={(selected) => {
                field.onChange(selected.map((g) => ({ genreId: g.value })));
              }}
              className="basic-multi-select"
              classNamePrefix="select"
            />
          );
        }}
      />
      <button type="submit">Create Movie</button>
    </form>
  );
};
