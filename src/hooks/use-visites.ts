import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export interface Visite {
  id:              number;
  annonce:         number;
  annonce_titre:   string;
  annonce_ville:   string;
  locataire:       number;
  locataire_nom:   string;
  locataire_email: string;
  locataire_phone: string;
  creneau?:        number;
  date_visite:     string;
  status:          "en_attente" | "confirmee" | "annulee";
  message:         string;
  created_at:      string;
}

// ── Locataire: ses visites ──
export function useVisitesLocataire() {
  return useQuery({
    queryKey:      ["visites-locataire"],
    queryFn:       async () => {
      const res = await api.get("/visites/mes-visites/");
      return res.data as Visite[];
    },
    refetchInterval: 30000,
  });
}

// ── Propriétaire: visites de ses annonces ──
export function useVisitesProprietaire() {
  return useQuery({
    queryKey:      ["visites-proprietaire"],
    queryFn:       async () => {
      const res = await api.get("/visites/proprietaire/");
      return res.data as Visite[];
    },
    refetchInterval: 30000,
  });
}

// ── Locataire: demander visite ──
export function useDemanderVisite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      annonce:     number;
      date_visite: string;
      creneau?:    number;
      message?:    string;
    }) => {
      const res = await api.post("/visites/demander/", data);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["visites-locataire"] });
    },
  });
}

// ── Propriétaire: confirmer / annuler ──
export function useGererVisite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: "confirmee" | "annulee" }) => {
      const res = await api.patch(`/visites/${id}/gerer/`, { status });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["visites-proprietaire"] });
    },
  });
}