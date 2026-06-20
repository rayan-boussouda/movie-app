import { useState } from "react";
import type { Genre } from "../../../../../domain/genre";
import { useUpdateGenre, useDeleteGenre } from "../../hooks/useGenre";
import { httpGenreGateway } from "../../../../../infra/genre/http-genre-gateway";

export const GenreItem = ({ genre }: { genre: Genre }) => {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(genre.name);

  const { mutate: update } = useUpdateGenre(httpGenreGateway);
  const { mutate: remove } = useDeleteGenre(httpGenreGateway);

  const handleUpdate = () => {
    if (name.trim() && name !== genre.name) {
      update({ id: genre.id, name });
    }
    setEditing(false);
  };

  return (
    <div className="flex items-center gap-2 border rounded px-3 py-1">
      {editing ? (
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleUpdate}
          onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
          className="outline-none text-sm"
        />
      ) : (
        <span
          className="text-sm cursor-pointer"
          onClick={() => setEditing(true)}
        >
          {genre.name}
        </span>
      )}
      <button
        onClick={() => remove(genre.id)}
        className="text-gray-400 hover:text-red-500 text-xs ml-1"
      >
        ✕
      </button>
    </div>
  );
};
