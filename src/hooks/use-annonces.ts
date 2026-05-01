import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export interface AnnonceImage {
  id:    number;
  image: string;
  ordre: number;
}

export interface Creneau {
  id:         number;
  annonce:    number;
  date_heure: string;
  disponible: boolean;
}

export interface Annonce {
  id:               number;
  titre:            string;
  description:      string;
  type_bien:        string;
  ville:            string;
  adresse:          string;
  loyer:            string;
  surface:          number;
  nb_pieces:        number;
  status:           "active" | "en_moderation" | "suspendue" | "rejetee";
  created_at:       string;
  proprietaire:     number;
  proprietaire_nom: string;
  images:           AnnonceImage[];
}

export interface AnnonceCreate {
  titre:       string;
  description: string;
  type_bien:   string;
  ville:       string;
  adresse:     string;
  loyer:       string;
  surface:     string;
  nb_pieces:   string;
}

export function useAnnonces(filters?: {
  ville?: string; type_bien?: string; loyer_max?: number;
}) {
  const params = new URLSearchParams();
  if (filters?.ville)     params.set("ville",     filters.ville);
  if (filters?.type_bien) params.set("type_bien", filters.type_bien);
  if (filters?.loyer_max) params.set("loyer_max", String(filters.loyer_max));

  return useQuery({
    queryKey: ["annonces", filters],
    queryFn:  async () => {
      const res = await api.get(`/annonces/?${params}`);
      return res.data as Annonce[];
    },
  });
}

export function useAnnonce(id: number) {
  return useQuery({
    queryKey: ["annonce", id],
    queryFn:  async () => {
      const res = await api.get(`/annonces/${id}/`);
      return res.data as Annonce;
    },
    enabled: !!id,
  });
}

export function useMesAnnonces() {
  return useQuery({
    queryKey: ["mes-annonces"],
    queryFn:  async () => {
      const res = await api.get("/annonces/mes-annonces/");
      return res.data as Annonce[];
    },
  });
}

export function useCreerAnnonce() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: AnnonceCreate) => {
      const res = await api.post("/annonces/creer/", data);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["mes-annonces"] }),
  });
}

export function useModifierAnnonce() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<AnnonceCreate & { status: string }> }) => {
      const res = await api.patch(`/annonces/${id}/edit/`, data);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["mes-annonces"] }),
  });
}

export function useSuspendreAnnonce() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: "active" | "suspendue" }) => {
      const res = await api.patch(`/annonces/${id}/suspendre/`, { status });
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["mes-annonces"] }),
  });
}

export function useSupprimerAnnonce() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/annonces/${id}/edit/`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["mes-annonces"] }),
  });
}

export function useAdminAnnonces() {
  return useQuery({
    queryKey: ["admin-annonces"],
    queryFn:  async () => {
      const res = await api.get("/annonces/admin/all/");
      return res.data as Annonce[];
    },
  });
}

export function useModererAnnonce() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await api.patch(`/annonces/admin/${id}/moderer/`, { status });
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-annonces"] }),
  });
}

export function useCreneauxAnnonce(annonceId: number) {
  return useQuery({
    queryKey: ["creneaux", annonceId],
    queryFn:  async () => {
      const res = await api.get(`/visites/annonce/${annonceId}/creneaux/`);
      return res.data as Creneau[];
    },
    enabled: !!annonceId,
  });
}