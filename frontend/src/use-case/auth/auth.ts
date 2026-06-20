import type { LoginCredentials } from "@/domain/auth";
import type { AuthGateway } from "@/domain/auth.port";

export const builLogin =
  (gateway: AuthGateway) => async (credentials: LoginCredentials) => {
    const login = await gateway.login(credentials);
    localStorage.setItem("token", login.token);
    return login;
  };
