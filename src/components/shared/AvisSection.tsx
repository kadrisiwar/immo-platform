"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Star, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import api from "@/lib/api";

function StarRating({ value, onChange, readonly = false }: {
  value: number; onChange?: (v: number) => void; readonly?: boolean;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          className="disabled:cursor-default"
        >
          <Star
            className={`h-5 w-5 transition-colors ${
              star <= (hover || value)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export function AvisSection({ annonceId }: { annonceId: number }) {
  const qc = useQueryClient();
  const [note, setNote]           = useState(0);
  const [commentaire, setCommentaire] = useState("");
  const [showForm, setShowForm]   = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["avis", annonceId],
    queryFn:  async () => {
      const res = await api.get(`/avis/annonce/${annonceId}/`);
      return res.data;
    },
  });

  const ajouter = useMutation({
    mutationFn: async () => {
      await api.post(`/avis/annonce/${annonceId}/ajouter/`, { note, commentaire });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["avis", annonceId] });
      setNote(0);
      setCommentaire("");
      setShowForm(false);
    },
  });

  const avis    = data?.avis    || [];
  const moyenne = data?.moyenne || 0;
  const total   = data?.total   || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Avis et notes</span>
          {total > 0 && (
            <div className="flex items-center gap-2">
              <StarRating value={Math.round(moyenne)} readonly />
              <span className="text-2xl font-bold">{moyenne}</span>
              <span className="text-sm text-muted-foreground">({total} avis)</span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* Formulaire avis */}
        {!showForm ? (
          <Button variant="outline" onClick={() => setShowForm(true)}>
            <Star className="mr-2 h-4 w-4" /> Donner un avis
          </Button>
        ) : (
          <div className="border rounded-xl p-4 space-y-3 bg-secondary/30">
            <div className="space-y-1">
              <p className="text-sm font-medium">Votre note</p>
              <StarRating value={note} onChange={setNote} />
            </div>
            <Textarea
              placeholder="Votre commentaire..."
              rows={3}
              value={commentaire}
              onChange={e => setCommentaire(e.target.value)}
            />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowForm(false)}>
                Annuler
              </Button>
              <Button
                size="sm"
                onClick={() => ajouter.mutate()}
                disabled={!note || !commentaire || ajouter.isPending}
              >
                <Send className="mr-2 h-4 w-4" />
                {ajouter.isPending ? "Envoi..." : "Publier"}
              </Button>
            </div>
          </div>
        )}

        {/* Liste avis */}
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Chargement...</p>
        ) : avis.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Aucun avis pour le moment — soyez le premier!
          </p>
        ) : (
          <div className="space-y-4">
            {avis.map((a: any) => (
              <div key={a.id} className="flex gap-3">
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarFallback className="text-xs">
                    {a.auteur_nom.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{a.auteur_nom}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(a.created_at).toLocaleDateString("fr-TN")}
                    </p>
                  </div>
                  <StarRating value={a.note} readonly />
                  <p className="text-sm text-muted-foreground mt-1">{a.commentaire}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}