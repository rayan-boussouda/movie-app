import z from 'zod';
export const registerSchema = z.object({
  body: z.object({
    email: z.email('Invalid Email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.email(),
    password: z.string().min(1, 'Password requireds'),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
