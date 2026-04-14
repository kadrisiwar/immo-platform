import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

// ── Types ──
export interface Annonce {
  id: number;
  titre: string;
  description: string;
  type_bien: string;
  ville: string;
  adresse: string;
  loyer: string;
  surface: number;
  nb_pieces: number;
  status: "active" | "en_moderation" | "suspendue" | "rejetee";
  created_at: string;
  proprietaire: number;
  proprietaire_nom: string;
}

export interface AnnonceCreate {
  titre: string;
  description: string;
  type_bien: string;
  ville: string;
  adresse: string;
  loyer: string;
  caution?: string;
  surface: string;
  nb_pieces: string;
}

// ── Hooks ──

// Liste publique
export function useAnnonces(filters?: {
  ville?: string;
  type_bien?: string;
  loyer_max?: number;
}) {
  const params = new URLSearchParams();
  if (filters?.ville) params.set("ville", filters.ville);
  if (filters?.type_bien) params.set("type_bien", filters.type_bien);
  if (filters?.loyer_max) params.set("loyer_max", String(filters.loyer_max));

  return useQuery({
    queryKey: ["annonces", filters],
    queryFn: async () => {
      const res = await api.get(`/annonces/?${params.toString()}`);
      return res.data as Annonce[];
    },
  });
}

// Détail annonce
export function useAnnonce(id: number) {
  return useQuery({
    queryKey: ["annonce", id],
    queryFn: async () => {
      const res = await api.get(`/annonces/${id}/`);
      return res.data as Annonce;
    },
    enabled: !!id,
  });
}

// Mes annonces (propriétaire)
export function useMesAnnonces() {
  return useQuery({
    queryKey: ["mes-annonces"],
    queryFn: async () => {
      const res = await api.get("/annonces/mes-annonces/");
      return res.data as Annonce[];
    },
  });
}

// Créer annonce
export function useCreerAnnonce() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: AnnonceCreate) => {
      const res = await api.post("/annonces/creer/", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mes-annonces"] });
    },
  });
}

// Admin: toutes les annonces
export function useAdminAnnonces() {
  return useQuery({
    queryKey: ["admin-annonces"],
    queryFn: async () => {
      const res = await api.get("/annonces/admin/all/");
      return res.data as Annonce[];
    },
  });
}

// Admin: modérer
export function useModererAnnonce() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await api.patch(`/annonces/admin/${id}/moderer/`, { status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-annonces"] });
    },
  });
}

// Supprimer annonce
export function useSupprimerAnnonce() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/annonces/${id}/supprimer/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mes-annonces"] });
    },
  });
}
