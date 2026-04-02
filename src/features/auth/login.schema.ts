import { z } from "zod";

export const loginSchema = z.object({
  user: z.string().min(2, "Informe usuário"),
  email: z.string().email(),
  password: z.string().min(6),
});