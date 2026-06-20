import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import {
  loginCredentialsSchema,
  type LoginCredentials,
} from "../../../../domain/auth";
import { useLogin } from "../hooks/useAuth";
import { httpAuthGateway } from "../../../../infra/auth/http-auth-gateway";

export const Login = () => {
  const {
    mutate: login,
    isPending,
    isError,
    error,
  } = useLogin(httpAuthGateway);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginCredentialsSchema),
  });

  const onSubmit = (data: LoginCredentials) => {
    login(data, {
      onSuccess: () => {
        navigate("/genres");
      },
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-80"
      >
        <h1 className="text-2xl font-bold">Login</h1>

        <div className="flex flex-col gap-1">
          <input
            {...register("email")}
            type="email"
            placeholder="Email"
            className="border p-2 rounded"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <input
            {...register("password")}
            type="password"
            placeholder="Password"
            className="border p-2 rounded"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        {isError && (
          <p className="text-red-500 text-sm">
            {(error as Error).message ?? "Login failed"}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="bg-black text-white p-2 rounded disabled:opacity-50"
        >
          {isPending ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};
