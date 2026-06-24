import { useState } from "react";
import { useGetMovies } from "../../hooks/useMovie";
import { httpMoviesGateway } from "@/infra/movie/http-movie-gateway";
import type { GetMoviesByPageParams } from "@/domain/movie";

export const MoviesList = () => {
  const [params, setParams] = useState<GetMoviesByPageParams>({
    page: 1,
    limit: 5,
    sortBy: "title",
    order: "asc",
  });
  const { data, isError, error } = useGetMovies(params, httpMoviesGateway);
  if (isError) return <p> somehting went wrong</p>;
  return (
    <div className="max-w-xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-semibold mb-6">Movies</h1>

      <ul className="space-y-2 mb-6">
        {data?.movies.map((movie) => (
          <li
            key={movie.id}
            className="px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-800"
          >
            {movie.title}
          </li>
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
    </div>
  );
};
