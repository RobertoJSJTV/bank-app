import { useMemo } from "react";
import { Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAccountStore } from "../store/useAccountStore";
import { useAuthStore } from "../store/useAuthStore";
import { useQueryClient, useQuery } from "@tanstack/react-query";

const transferSchema = z.object({
  to: z.string().min(2, "Informe destinatário"),
  amount: z.number().positive("Valor deve ser positivo"),
  description: z.string().min(3, "Informe descrição"),
});

type TransferValues = z.infer<typeof transferSchema>;

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);

  const { balance, transactions, transfer } = useAccountStore();
  const queryClient = useQueryClient();

  const balanceQuery = useQuery<{ balance: number }>({
    queryKey: ["balance"],
    queryFn: async () => ({ balance }),
    staleTime: 1000 * 5,
  });

  const { register, handleSubmit, reset, formState } = useForm<TransferValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: { to: "", amount: 0, description: "" },
  });

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  const onSubmit = (data: TransferValues) => {
    const ok = transfer(data.amount, data.description);
    if (!ok) {
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["balance"] });
    reset();
  };

  const formattedBalance = useMemo(
    () =>
      balanceQuery.data?.balance.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      }) ?? "R$ 0,00",
    [balanceQuery.data],
  );

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-sm text-gray-600">Olá, {user.name}</p>
        </div>
        <button
          onClick={() => logout()}
          className="btn1 rounded bg-red-500 px-4 py-2 text-white"
        >
          Sair
        </button>
      </header>

      <section className="rounded border p-4">
        <h2 className="text-xl font-semibold mb-3">Saldo</h2>
        <p className="text-4xl font-extrabold text-green-600">{formattedBalance}</p>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <article className="rounded border p-4">
          <h2 className="text-xl font-semibold mb-3">Transferência</h2>
          <form className="space-y-3" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div>
              <input
                {...register("to")}
                placeholder="Para"
                className="w-full border px-3 py-2 rounded"
              />
              {formState.errors.to && (
                <p className="text-xs text-red-500">{formState.errors.to.message}</p>
              )}
            </div>
            <div>
              <input
                {...register("amount", { valueAsNumber: true })}
                placeholder="Valor"
                type="number"
                step="0.01"
                min="0"
                className="w-full border px-3 py-2 rounded"
              />
              {formState.errors.amount && (
                <p className="text-xs text-red-500">{formState.errors.amount.message}</p>
              )}
            </div>
            <div>
              <input
                {...register("description")}
                placeholder="Descrição"
                className="w-full border px-3 py-2 rounded"
              />
              {formState.errors.description && (
                <p className="text-xs text-red-500">{formState.errors.description.message}</p>
              )}
            </div>
            <button className="btn2 w-full bg-blue-600 text-white py-2 rounded" type="submit">
              Enviar transferência
            </button>
          </form>
        </article>

        <article className="rounded border p-4 bg">
          <h2 className="text-xl font-semibold mb-3 mt-4">Transações recentes</h2>
          <div className="space-y-2 max-h-72 overflow-auto">
            {transactions.length === 0 ? (
              <p>Nenhuma transação encontrada.</p>
            ) : (
              transactions.map((tx) => (
                <div key={tx.id} className="flex justify-between rounded border p-2 bg-transaction">
                  <div>
                    <p className="font-semibold">{tx.description}</p>
                    <p className="text-xs text-gray-500">{tx.date}</p>
                  </div>
                  <p className={`font-bold ${tx.type === "debit" ? "text-red-500" : "text-green-500"}`}>
                    {tx.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </p>
                </div>
              ))
            )}
          </div>
        </article>
      </section>
    </main>
  );
}
