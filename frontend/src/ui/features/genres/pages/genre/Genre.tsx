import { httpGenreGateway } from "@/infra/genre/http-genre-gateway";
import { useGetGenre } from "../../hooks/useGenre";
import { CreateGenreForm } from "./CreateGenre";
import { GenreItem } from "./GenreItem";

export const Genre = () => {
  const { data, isLoading, isError } = useGetGenre(httpGenreGateway);
  if (isLoading) return <p>loading...</p>;
  if (isError) return <p>error...</p>;
  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap">
        {data?.map((genre) => (
          <GenreItem key={genre.id} genre={genre} />
        ))}
      </div>
      <CreateGenreForm />
    </div>
  );
};
