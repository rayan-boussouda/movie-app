import { httpMoviesGateway } from "@/infra/movie/http-movie-gateway";
import {
  useCreateMovie,
  useUpdateMovie,
  useUploadMoviePicture,
} from "../../hooks/useMovie";
import {
  createMovieSchema,
  type CreateMovie,
  type Movie,
} from "@/domain/movie";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useGetGenre } from "../../hooks/useGenre";
import { httpGenreGateway } from "@/infra/genre/http-genre-gateway";
import Select from "react-select";
import { toSelectOptions } from "@/utils/toSelectOptions";
import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Input } from "@rayan.boussouda/ui-kit";

export const CreateAndUpdateMovieForm = ({
  movie,
  onSuccess,
  onCancel,
}: {
  movie?: Movie;
  onSuccess?: () => void;
  onCancel?: () => void;
}) => {
  const { mutateAsync: createMovie } = useCreateMovie(httpMoviesGateway);
  const { mutateAsync: updateMovie } = useUpdateMovie(httpMoviesGateway);
  const { mutateAsync: uploadMoviePicture } =
    useUploadMoviePicture(httpMoviesGateway);
  const { data: genres } = useGetGenre(httpGenreGateway);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateMovie>({
    resolver: zodResolver(createMovieSchema),
    defaultValues: movie
      ? {
          title: movie.title,
          synopsis: movie.synopsis,
          releaseYear: movie.releaseYear.slice(0, 10),
          genres: movie.genres.map((g) => ({ genreId: g.id })),
        }
      : {
          title: "",
          synopsis: "",
          releaseYear: "",
          genres: [],
        },
  });

  const [posterFile, setPosterFile] = useState<File>();
  const [posterName, setPosterName] = useState<string>();
  const fileRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const onSubmit = async (data: CreateMovie) => {
    if (movie) {
      await updateMovie({ id: movie.id, data });
    } else {
      const created = await createMovie(data);
      if (posterFile) {
        await uploadMoviePicture({ id: created.id, file: posterFile });
      }
    }
    queryClient.invalidateQueries({ queryKey: ["getMovies"] });
    onSuccess?.();
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit, (errors) =>
          console.log("validation errors", errors),
        )}
      >
        <div className="flex flex-col gap-4">
          <Input
            {...register("title")}
            type="text"
            placeholder="Title"
            error={errors.title?.message}
          />

          <Input
            {...register("synopsis")}
            type="text"
            placeholder="Synopsis"
            error={errors.synopsis?.message}
          />

          <Input
            {...register("releaseYear")}
            type="date"
            label="Release Year"
            error={errors.releaseYear?.message}
          />

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setPosterFile(file);
                setPosterName(file.name);
              }
            }}
          />
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileRef.current?.click()}
            >
              Choose poster
            </Button>
            <span className="text-sm text-neutral-500">
              {posterName ?? "No file chosen"}
            </span>
          </div>

          <Controller
            control={control}
            name="genres"
            render={({ field }) => {
              const selectedIds = field?.value?.map((g) => g.genreId) ?? [];
              return (
                <Select
                  isMulti
                  options={toSelectOptions(genres ?? [])}
                  value={toSelectOptions(genres ?? []).filter((option) =>
                    selectedIds?.includes(option.value),
                  )}
                  onChange={(selected) => {
                    field.onChange(selected.map((g) => ({ genreId: g.value })));
                  }}
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
              );
            }}
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {movie ? "Update Movie" : "Create Movie"}
          </Button>
        </div>
      </form>
    </div>
  );
};
