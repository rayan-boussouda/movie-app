import z from "zod";

export const loginCredentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export type LoginCredentials = z.infer<typeof loginCredentialsSchema>;

export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.email(),
  role: z.enum(["USER", "ADMIN"]),
});
export type User = z.infer<typeof userSchema>;

export const loginResponseSchema = z.object({
  token: z.string(),
});
export type LoginResponse = z.infer<typeof loginResponseSchema>;
