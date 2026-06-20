import { httpGenreGateway } from "../../../infra/genre/http-genre-gateway";
import { Tag } from "../../components/tag";
import { useGetGenre } from "./hooks/useGenre";

export const Genre = () => {
  const { data, isLoading, isError } = useGetGenre(httpGenreGateway);
  if (isLoading) return <p> loading...</p>;
  if (isError) return <p> error...</p>;
  return (
    <div className="flex gap-2 flex-wrap">
      {data?.map((genre) => (
        <Tag key={genre.id} name={genre.name} />
      ))}
    </div>
  );
};
