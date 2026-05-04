"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import api from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";

type VisiteStatus = "en_attente" | "confirmee" | "annulee";

function StatusBadge({ status }: { status: VisiteStatus }) {
  const map = {
    en_attente: { label: "En attente", cls: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" },
    confirmee:  { label: "Confirmée",  cls: "bg-green-100 text-green-800 hover:bg-green-100" },
    annulee:    { label: "Annulée",    cls: "bg-red-100 text-red-800 hover:bg-red-100" },
  };
  return <Badge className={map[status]?.cls}>{map[status]?.label}</Badge>;
}

export default function ProprietaireVisitesPage() {
  const qc = useQueryClient();
  const [visites, setVisites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number | null>(null);

  const fetchVisites = async () => {
    try {
      setLoading(true);
      const res = await api.get("/visites/proprietaire/");
      setVisites(res.data);
    } catch (error) {
      console.error("Erreur chargement visites:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisites();
  }, []);

  const gererVisite = async (id: number, status: string) => {
    setProcessing(id);
    try {
      await api.patch(`/visites/${id}/gerer/`, { status });
      await fetchVisites(); // راجع التحميل
      qc.invalidateQueries({ queryKey: ["visites-proprietaire"] });
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors du traitement");
    } finally {
      setProcessing(null);
    }
  };

  const enAttente  = visites.filter(v => v.status === "en_attente");
  const confirmees = visites.filter(v => v.status === "confirmee");
  const annulees   = visites.filter(v => v.status === "annulee");

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-muted-foreground">Chargement...</div>
    </div>
  );

  function VisiteCard({ v }: { v: any }) {
    return (
      <div className="rounded-lg border p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-medium">{v.locataire_nom}</p>
            <p className="text-xs text-muted-foreground">{v.locataire_email}</p>
          </div>
          <StatusBadge status={v.status} />
        </div>
        <div className="text-sm space-y-1">
          <p><span className="text-muted-foreground">Annonce:</span> {v.annonce_titre}</p>
          <p><span className="text-muted-foreground">Ville:</span> {v.annonce_ville}</p>
          <p><span className="text-muted-foreground">Date:</span> {new Date(v.date_visite).toLocaleString("fr-TN")}</p>
          {v.message && (
            <p><span className="text-muted-foreground">Message:</span> {v.message}</p>
          )}
        </div>
        {v.status === "en_attente" && (
          <div className="flex gap-2 pt-1">
            <Button
              size="sm"
              style={{ backgroundColor: "#16a34a", color: "white" }}
              className="flex-1"
              onClick={() => gererVisite(v.id, "confirmee")}
              disabled={processing === v.id}
            >
              <CheckCircle className="mr-2 h-4 w-4" /> Confirmer
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="flex-1"
              onClick={() => gererVisite(v.id, "annulee")}
              disabled={processing === v.id}
            >
              <XCircle className="mr-2 h-4 w-4" /> Annuler
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Gestion des visites</h1>
        <p className="text-sm text-muted-foreground">
          Confirmez ou annulez les demandes de visite
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">{enAttente.length}</div>
            <p className="text-xs text-muted-foreground mt-1">En attente</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{confirmees.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Confirmées</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-destructive">{annulees.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Annulées</p>
          </CardContent>
        </Card>
      </div>

      {visites.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p className="font-medium">Aucune visite pour le moment</p>
            <p className="text-sm mt-1">Les demandes de visite apparaîtront ici</p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="en_attente">
          <TabsList>
            <TabsTrigger value="en_attente">En attente ({enAttente.length})</TabsTrigger>
            <TabsTrigger value="confirmee">Confirmées ({confirmees.length})</TabsTrigger>
            <TabsTrigger value="annulee">Annulées ({annulees.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="en_attente" className="space-y-3 mt-4">
            {enAttente.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Aucune visite en attente</p>
            ) : (
              enAttente.map(v => <VisiteCard key={v.id} v={v} />)
            )}
          </TabsContent>

          <TabsContent value="confirmee" className="space-y-3 mt-4">
            {confirmees.map(v => <VisiteCard key={v.id} v={v} />)}
          </TabsContent>

          <TabsContent value="annulee" className="space-y-3 mt-4">
            {annulees.map(v => <VisiteCard key={v.id} v={v} />)}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}