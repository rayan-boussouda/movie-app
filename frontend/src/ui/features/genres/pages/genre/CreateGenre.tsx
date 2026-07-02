import { zodResolver } from "@hookform/resolvers/zod";
import { createGenreSchema, type CreateGenre } from "@/domain/genre";
import { useForm } from "react-hook-form";
import { useCreateGenre } from "../../hooks/useGenre";
import { httpGenreGateway } from "@/infra/genre/http-genre-gateway";
import { Button } from "@rayan.boussouda/ui-kit";

export const CreateGenreForm = () => {
  const {
    mutate: addGenre,
    isError,
    isPending,
  } = useCreateGenre(httpGenreGateway);
  const {
    register,
    reset,
    handleSubmit,

    formState: { errors },
  } = useForm<CreateGenre>({ resolver: zodResolver(createGenreSchema) });

  const onSubmit = (data: CreateGenre) => {
    addGenre(data, { onSuccess: () => reset() });
  };

  if (isError) return <p>error...</p>;

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("name")} type="text" placeholder="Genre name" />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        <Button
          type="submit"
          disabled={isPending}
          className="bg-black text-white p-2 rounded disabled:opacity-50"
        >
          {isPending ? "Creating..." : "Create Genre"}
        </Button>
      </form>
    </div>
  );
};
