import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export interface Visite {
  id: number;
  annonce: number;
  annonce_titre: string;
  annonce_ville: string;
  locataire: number;
  locataire_nom: string;
  locataire_email: string;
  locataire_phone: string;
  date_visite: string;
  status: "en_attente" | "confirmee" | "annulee";
  message: string;
  created_at: string;
}

// Propriétaire: ses visites
export function useVisitesProprietaire() {
  return useQuery({
    queryKey: ["visites-proprietaire"],
    queryFn: async () => {
      const res = await api.get("/visites/proprietaire/");
      return res.data as Visite[];
    },
  });
}

// Locataire: ses visites
export function useVisitesLocataire() {
  return useQuery({
    queryKey: ["visites-locataire"],
    queryFn: async () => {
      const res = await api.get("/visites/mes-visites/");
      return res.data as Visite[];
    },
  });
}

// Demander une visite
export function useDemanderVisite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      annonce: number;
      date_visite: string;
      message?: string;
    }) => {
      const res = await api.post("/visites/demander/", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visites-locataire"] });
    },
  });
}

// Propriétaire: confirmer/annuler
export function useGererVisite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await api.patch(`/visites/${id}/gerer/`, { status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visites-proprietaire"] });
    },
  });
}
