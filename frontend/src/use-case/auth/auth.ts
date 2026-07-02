import { userSchema, type LoginCredentials, type User } from "@/domain/auth";
import type { AuthGateway } from "@/domain/auth.port";

export const builLogin =
  (gateway: AuthGateway) => async (credentials: LoginCredentials) => {
    const login = await gateway.login(credentials);
    localStorage.setItem("token", login.token);
    localStorage.setItem("user", JSON.stringify(login.user));
    return login;
  };

export const getCurrentUser = (): User | null => {
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  const parsed = userSchema.safeParse(JSON.parse(raw));
  return parsed.success ? parsed.data : null;
};
