"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Plus, Trash2, ChevronLeft, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import Link from "next/link";

export default function CreneauxPage() {
  const { id }      = useParams();
  const router      = useRouter();
  const qc          = useQueryClient();
  const [newDate, setNewDate] = useState("");

  const { data: creneaux = [], isLoading } = useQuery({
    queryKey: ["creneaux-proprio", id],
    queryFn:  async () => {
      const r = await api.get(`/visites/annonce/${id}/creneaux/`);
      return r.data;
    },
  });

  const ajouter = useMutation({
    mutationFn: async (date_heure: string) => {
      const r = await api.post(`/visites/annonce/${id}/creneaux/ajouter/`, { date_heure });
      return r.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["creneaux-proprio", id] });
      setNewDate("");
    },
  });

  const supprimer = useMutation({
    mutationFn: async (creneauId: number) => {
      await api.delete(`/visites/creneaux/${creneauId}/supprimer/`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["creneaux-proprio", id] }),
  });

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/proprietaire/annonces"><ChevronLeft className="h-5 w-5" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">Créneaux de visite</h1>
          <p className="text-sm text-muted-foreground">Gérez les disponibilités pour cette annonce</p>
        </div>
      </div>

      {/* Ajouter créneau */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ajouter un créneau</CardTitle>
          <CardDescription>Les locataires pourront choisir parmi ces créneaux</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <Label>Date et heure</Label>
            <Input
              type="datetime-local"
              value={newDate}
              onChange={e => setNewDate(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
          <Button
            className="w-full"
            onClick={() => newDate && ajouter.mutate(new Date(newDate).toISOString())}
            disabled={!newDate || ajouter.isPending}
          >
            <Plus className="mr-2 h-4 w-4" />
            {ajouter.isPending ? "Ajout..." : "Ajouter le créneau"}
          </Button>
        </CardContent>
      </Card>

      {/* Liste créneaux */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Créneaux disponibles ({creneaux.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Chargement...</div>
          ) : creneaux.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p>Aucun créneau ajouté</p>
            </div>
          ) : (
            <div className="space-y-2">
              {creneaux.map((c: any) => (
                <div key={c.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {new Date(c.date_heure).toLocaleString("fr-TN")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={c.disponible ? "default" : "secondary"}>
                      {c.disponible ? "Disponible" : "Réservé"}
                    </Badge>
                    {c.disponible && (
                      <Button
                        variant="ghost" size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => supprimer.mutate(c.id)}
                        disabled={supprimer.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}