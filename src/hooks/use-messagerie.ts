import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export interface Message {
  id: number;
  expediteur: number;
  expediteur_nom: string;
  contenu: string;
  lu: boolean;
  created_at: string;
}

export interface Conversation {
  id: number;
  annonce: number;
  annonce_titre: string;
  proprietaire: number;
  proprietaire_nom: string;
  locataire: number;
  locataire_nom: string;
  messages: Message[];
  non_lus: number;
  created_at: string;
}

export function useConversations() {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const res = await api.get("/messagerie/");
      return res.data as Conversation[];
    },
  });
}

export function useConversation(id: number) {
  return useQuery({
    queryKey: ["conversation", id],
    queryFn: async () => {
      const res = await api.get(`/messagerie/${id}/`);
      return res.data as Conversation;
    },
    enabled: !!id,
    refetchInterval: 5000,
  });
}

export function useEnvoyerMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      convId,
      contenu,
    }: {
      convId: number;
      contenu: string;
    }) => {
      const res = await api.post(`/messagerie/${convId}/envoyer/`, { contenu });
      return res.data;
    },
    onSuccess: (_, { convId }) => {
      queryClient.invalidateQueries({ queryKey: ["conversation", convId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}
