import type { LoginCredentials, LoginResponse } from "./auth";

export type AuthGateway = {
  login: (logs: LoginCredentials) => Promise<LoginResponse>;
};
