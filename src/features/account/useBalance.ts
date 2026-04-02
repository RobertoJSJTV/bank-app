import { useQuery } from "@tanstack/react-query";
import { useAccountStore } from "../../store/useAccountStore";

export function useBalance() {
  return useQuery({
    queryKey: ["balance"],
    queryFn: async () => {
      const state = useAccountStore.getState();
      return { balance: state.balance };
    },
    staleTime: 1000 * 10,
  });
}