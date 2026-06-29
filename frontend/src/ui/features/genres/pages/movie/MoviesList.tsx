import { useState } from "react";
import { useGetMovies } from "../../hooks/useMovie";
import { httpMoviesGateway } from "@/infra/movie/http-movie-gateway";
import type { GetMoviesByPageParams, Movie } from "@/domain/movie";
import { CreateMovieForm } from "./CreateMovie";
import { useCreateRating, useUpdateRating } from "../../hooks/useRating";
import { httpRatingGateway } from "@/infra/rating/http-rating-gateway";
import { getCurrentUser } from "@/use-case/auth/auth";
import type { EmbeddedRating } from "@/domain/rating";

export const MoviesList = () => {
  const [modal, setModal] = useState<boolean>(false);
  const { mutate: createRating } = useCreateRating(httpRatingGateway);
  const { mutate: updateRating } = useUpdateRating(httpRatingGateway);

  const [params, setParams] = useState<GetMoviesByPageParams>({
    page: 1,
    limit: 5,
    sortBy: "title",
    order: "desc",
  });

  const { data, isError, error } = useGetMovies(params, httpMoviesGateway);

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
    setModal(false);
  };

  if (isError) return <p> somehting went wrong</p>;
  return (
    <div className="max-w-xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-semibold mb-6">Movies</h1>
      <ul className="space-y-2 mb-6">
        {data?.movies.map((movie) => (
          <div>
            <div
              onClick={() => setModal(true)}
              className="w-5 h-5 border border-red-300 rounded-full text-green-300 transition-transform duration-200 hover:scale-110 flex items-center justify-center cursor-pointer"
            >
              {movie.averageRating}
            </div>
            <li
              key={movie.id}
              className="px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-800"
            >
              {movie.title}
            </li>

            {modal && (
              <div className="absolute bg-white border border-gray-200 rounded-lg shadow-lg p-3 flex gap-2">
                {Array.from({ length: 5 }, (_, i) => i + 1).map((num) => (
                  <span
                    key={num}
                    className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                    onClick={() => handleRate(num, movie)}
                  >
                    {num}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
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

      <CreateMovieForm />
    </div>
  );
};
