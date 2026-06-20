import { loginResponseSchema, type LoginCredentials } from "../../domain/auth";
import type { AuthGateway } from "../../domain/auth.port";
import { httpClient } from "../http-client";

export const httpAuthGateway: AuthGateway = {
  login: async (credentials: LoginCredentials) => {
    const response = await httpClient.post("/auth/login", credentials);
    return loginResponseSchema.parse(response.data);
  },
};
