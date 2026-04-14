import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export interface Contrat {
  id: number;
  annonce: number;
  annonce_titre: string;
  proprietaire: number;
  proprietaire_nom: string;
  locataire: number;
  locataire_nom: string;
  date_debut: string;
  date_fin: string;
  loyer_mensuel: string;
  caution: string;
  status: "en_attente" | "signe" | "expire";
  created_at: string;
}

export function useContratsProprietaire() {
  return useQuery({
    queryKey: ["contrats-proprietaire"],
    queryFn: async () => {
      const res = await api.get("/contrats/proprietaire/");
      return res.data as Contrat[];
    },
  });
}

export function useContratsLocataire() {
  return useQuery({
    queryKey: ["contrats-locataire"],
    queryFn: async () => {
      const res = await api.get("/contrats/locataire/");
      return res.data as Contrat[];
    },
  });
}

export function useSignerContrat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.patch(`/contrats/${id}/signer/`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contrats-locataire"] });
    },
  });
}
