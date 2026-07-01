import { useCallback, useState } from "react";
import { useDeleteMovie, useGetMovies } from "../../hooks/useMovie";
import { httpMoviesGateway } from "@/infra/movie/http-movie-gateway";
import type { GetMoviesByPageParams, Movie } from "@/domain/movie";
import { CreateMovieForm } from "./CreateMovie";
import { useCreateRating, useUpdateRating } from "../../hooks/useRating";
import { httpRatingGateway } from "@/infra/rating/http-rating-gateway";
import { getCurrentUser } from "@/use-case/auth/auth";
import type { EmbeddedRating } from "@/domain/rating";
import { FormModal } from "@/ui/components/ModalGlobal";
import { MovieCard } from "@rayan.boussouda/ui-kit";
import { getDate } from "@/utils/getDate";
import { toUpperCaseFirstCharacter } from "@/utils/toUpperCaseFirstCharacter";

export const MoviesList = () => {
  const [modal, setModal] = useState<number | null>(null);
  const { mutate: createRating } = useCreateRating(httpRatingGateway);
  const { mutate: updateRating } = useUpdateRating(httpRatingGateway);
  const { mutate: deleteMovie } = useDeleteMovie(httpMoviesGateway);
  const [open, setOpen] = useState<boolean>(false);
  const [params, setParams] = useState<GetMoviesByPageParams>({
    page: 1,
    limit: 4,
    sortBy: "title",
    order: "desc",
  });
  const [dummy, setDummy] = useState(0);

  const { data, isError } = useGetMovies(params, httpMoviesGateway);

  const user = getCurrentUser();
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

  const handleEdit = useCallback((id: number) => {
    console.log("salut", id);
  }, []);

  const handleDelete = useCallback(
    (id: number) => {
      deleteMovie(id);
    },
    [deleteMovie],
  );

  if (isError) return <p> somehting went wrong</p>;
  return (
    <div className="realtive">
      {dummy}
      <h1 className="text-2xl font-semibold mb-6">Movies</h1>
      <button onClick={() => setDummy((d) => d + 1)}>re-render parent</button>

      <button
        onClick={() => setOpen(true)}
        className="absolute top-0 right-0 w-10 h-10 bg-blue-600 text-white rounded-full shadow-md hover:scale-110 transition-transform flex items-center justify-center text-xl"
      >
        +
      </button>
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
        open={open}
        onClose={() => setOpen(false)}
        title="Create Movie"
      >
        <CreateMovieForm
          onSuccess={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </FormModal>
    </div>
  );
};
