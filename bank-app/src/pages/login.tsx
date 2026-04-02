import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../features/auth/login.schema";
import { useAuthStore } from "../store/useAuthStore";
import '../index.css';

type LoginValues = {
  user: string;
  email: string;
  password: string;
};

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const { register, handleSubmit, formState } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {user: "", email: "", password: "" },
  });

  const onSubmit = (data: LoginValues) => {
    const mockToken = "token-fake-123";
    login(mockToken, { name: data.user, email: data.email });
    navigate("/dashboard");
  };

  const hasError = !!Object.keys(formState.errors).length;

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 titulo">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <input
            className="w-full border p-2 rounded"
            {...register("user")}
            placeholder="Usuário"
            type="text"
          />
          {formState.errors.user && (
            <p className="text-sm text-red-500">{formState.errors.user.message}</p>
          )}
        </div>

        <div>
          <input
            className="w-full border p-2 rounded"
            {...register("email")}
            placeholder="Email"
            type="email"
          />
          {formState.errors.email && (
            <p className="text-sm text-red-500">{formState.errors.email.message}</p>
          )}
        </div>

        <div>
          <input
            className="w-full border p-2 rounded"
            {...register("password")}
            placeholder="Senha"
            type="password"
          />
          {formState.errors.password && (
            <p className="text-sm text-red-500">{formState.errors.password.message}</p>
          )}
        </div>

        <button
          disabled={hasError}
          className="btn"
          type="submit"
        >
          Entrar
        </button>
      </form>
    </main>
  );
}