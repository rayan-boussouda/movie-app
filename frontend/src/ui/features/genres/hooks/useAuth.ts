import { useMutation } from "@tanstack/react-query";
import type { AuthGateway } from "../../../../domain/auth.port";
import { builLogin } from "../../../../use-case/auth/auth";

export const useLogin = (gateway: AuthGateway) => {
  return useMutation({
    mutationFn: builLogin(gateway),
  });
};
