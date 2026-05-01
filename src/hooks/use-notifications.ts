import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface Notification {
  id: string;
  type: string;
  message: string;
  date: string;
  lu: boolean;
}

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        const res = await api.get("/accounts/notifications/");
        return res.data as { notifications: Notification[]; non_lus: number };
      } catch {
        return { notifications: [], non_lus: 0 };
      }
    },
    refetchInterval: 30000,
  });
}