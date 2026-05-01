import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export function useFavoris() {
  return useQuery({
    queryKey: ["favoris"],
    queryFn:  async () => {
      try {
        const res = await api.get("/accounts/favoris/");
        return res.data as number[];
      } catch {
        return [] as number[];
      }
    },
  });
}

export function useToggleFavori() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (annonceId: number) => {
      const res = await api.post("/accounts/favoris/toggle/", { annonce_id: annonceId });
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["favoris"] }),
  });
}