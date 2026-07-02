import { useCallback, useState } from "react";
import { useDeleteMovie, useGetMovies } from "../../hooks/useMovie";
import { httpMoviesGateway } from "@/infra/movie/http-movie-gateway";
import type { GetMoviesByPageParams, Movie } from "@/domain/movie";
import { useCreateRating, useUpdateRating } from "../../hooks/useRating";
import { httpRatingGateway } from "@/infra/rating/http-rating-gateway";
import { getCurrentUser } from "@/use-case/auth/auth";
import type { EmbeddedRating } from "@/domain/rating";
import { FormModal } from "@/ui/components/ModalGlobal";
import { MovieCard } from "@rayan.boussouda/ui-kit";
import { getDate } from "@/utils/getDate";
import { toUpperCaseFirstCharacter } from "@/utils/toUpperCaseFirstCharacter";
import { CreateAndUpdateMovieForm } from "./CreateAndUpdateMovie";

type ModalState =
  | { mode: "closed" }
  | { mode: "create" }
  | { mode: "edit"; movie: Movie };

export const MoviesList = () => {
  const [modal, setModal] = useState<number | null>(null);
  const [modalState, setModalState] = useState<ModalState>({ mode: "closed" });
  const { mutate: createRating } = useCreateRating(httpRatingGateway);
  const { mutate: updateRating } = useUpdateRating(httpRatingGateway);
  const { mutate: deleteMovie } = useDeleteMovie(httpMoviesGateway);
  const [params, setParams] = useState<GetMoviesByPageParams>({
    page: 1,
    limit: 4,
    sortBy: "title",
    order: "desc",
  });

  const { data, isError } = useGetMovies(params, httpMoviesGateway);
  const user = getCurrentUser();

  const handleClose = useCallback(() => {
    setModalState({ mode: "closed" });
  }, []);

  const handleRate = (num: number, movie: Movie) => {
    const existingRating = movie?.ratings?.find(
      (r: EmbeddedRating) => r.userId === user?.id,
    );
    if (existingRating) {
      updateRating({ id: existingRating.id, data: { value: num } });
    } else {
      createRating({ movieId: movie.id, value: num });
    }
    setModal(null);
  };

  const handleEdit = useCallback(
    (id: number) => {
      const movie = data?.movies.find((m) => m.id === id);
      if (movie) setModalState({ mode: "edit", movie });
    },
    [data?.movies],
  );

  const handleDelete = useCallback(
    (id: number) => {
      deleteMovie(id);
    },
    [deleteMovie],
  );

  if (isError) return <p>Something went wrong</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Movies</h1>
        {user?.role === "ADMIN" && (
          <button
            onClick={() => setModalState({ mode: "create" })}
            className="w-10 h-10 bg-blue-600 text-white rounded-full shadow-md hover:scale-110 transition-transform flex items-center justify-center text-xl"
          >
            +
          </button>
        )}
      </div>

      <ul className="space-y-2 mb-6">
        <div className="grid grid-cols-4 gap-2">
          {data?.movies.map((movie) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              genres={movie.genres.map((g) => g.name)}
              overview={movie.synopsis}
              rating={movie.averageRating}
              posterUrl={
                movie.posterUrl ??
                "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba"
              }
              title={toUpperCaseFirstCharacter(movie.title)}
              year={Number(getDate(movie.releaseYear, "year"))}
              myRating={
                movie.ratings?.find((r) => r.userId === user?.id)?.value
              }
              onRate={(num) => handleRate(num, movie)}
              onEdit={user?.role === "ADMIN" ? handleEdit : undefined}
              onDelete={user?.role === "ADMIN" ? handleDelete : undefined}
            />
          ))}
        </div>
      </ul>

      <div className="flex items-center justify-between">
        <button
          disabled={params.page === 1}
          onClick={() =>
            setParams((prev) => ({ ...prev, page: prev.page - 1 }))
          }
          className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          ← Prev
        </button>

        <span className="text-sm text-gray-500">Page {params.page}</span>

        <button
          disabled={!data?.hasNext}
          onClick={() =>
            setParams((prev) => ({ ...prev, page: prev.page + 1 }))
          }
          className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          Next →
        </button>
      </div>

      <FormModal
        open={modalState.mode !== "closed"}
        onClose={handleClose}
        title={modalState.mode === "edit" ? "Edit Movie" : "Create Movie"}
      >
        <CreateAndUpdateMovieForm
          movie={modalState.mode === "edit" ? modalState.movie : undefined}
          onSuccess={handleClose}
          onCancel={handleClose}
        />
      </FormModal>
    </div>
  );
};
