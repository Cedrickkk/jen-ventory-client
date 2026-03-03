import z from "zod/v3";

export const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: "Password is required" }),
});

export type LoginForm = z.infer<typeof loginFormSchema>;
