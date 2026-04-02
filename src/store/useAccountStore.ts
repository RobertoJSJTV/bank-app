import { create } from "zustand";

type Transaction = {
  id: string;
  date: string;
  amount: number;
  description: string;
  type: "credit" | "debit";
};

type AccountState = {
  balance: number;
  transactions: Transaction[];
  transfer: (amount: number, description: string) => boolean;
  reset: () => void;
};

const initialTransactions: Transaction[] = [
  { id: "t1", date: "2026-03-27", amount: 1500, description: "Salário", type: "credit" },
  { id: "t2", date: "2026-03-29", amount: -60, description: "Supermercado", type: "debit" },
  { id: "t3", date: "2026-03-30", amount: -28.9, description: "Transporte", type: "debit" },
];

const localBalance = Number(localStorage.getItem("account_balance") ?? 2411.1);
const localTransactions = localStorage.getItem("account_transactions");

export const useAccountStore = create<AccountState>((set) => ({
  balance: Number.isFinite(localBalance) ? localBalance : 2411.1,
  transactions: localTransactions ? JSON.parse(localTransactions) : initialTransactions,
  transfer: (amount, description) => {
    if (amount <= 0 || amount > useAccountStore.getState().balance) return false;

    const { balance: currentBalance, transactions: currentTransactions } = useAccountStore.getState();
    const newBalance = Number((currentBalance - amount).toFixed(2));
    const newTransactions: Transaction[] = [
      {
        id: `t${Date.now()}`,
        date: new Date().toISOString().split("T")[0],
        amount: -amount,
        description,
        type: "debit",
      },
      ...currentTransactions,
    ];

    localStorage.setItem("account_balance", String(newBalance));
    localStorage.setItem("account_transactions", JSON.stringify(newTransactions));

    set({ balance: newBalance, transactions: newTransactions });
    return true;
  },
  reset: () => {
    localStorage.removeItem("account_balance");
    localStorage.removeItem("account_transactions");
    set({ balance: 2411.1, transactions: initialTransactions });
  },
}));