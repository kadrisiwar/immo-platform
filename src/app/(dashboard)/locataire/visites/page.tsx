"use client";

import { CalendarCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useVisitesLocataire } from "@/hooks/use-visites";

export default function LocataireVisitesPage() {
  const { data: visites = [], isLoading } = useVisitesLocataire();

  const enAttente = visites.filter((v) => v.status === "en_attente");
  const confirmees = visites.filter((v) => v.status === "confirmee");
  const annulees = visites.filter((v) => v.status === "annulee");

  function VisiteCard({ v }: { v: any }) {
    const statusMap = {
      en_attente: {
        label: "En attente",
        cls: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      },
      confirmee: {
        label: "Confirmée",
        cls: "bg-green-100 text-green-800 hover:bg-green-100",
      },
      annulee: {
        label: "Annulée",
        cls: "bg-red-100 text-red-800 hover:bg-red-100",
      },
    };
    const s = statusMap[v.status as keyof typeof statusMap];
    return (
      <div className="rounded-lg border p-4 space-y-2">
        <div className="flex items-start justify-between">
          <p className="font-medium">{v.annonce_titre}</p>
          <Badge className={s.cls}>{s.label}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">📍 {v.annonce_ville}</p>
        <p className="text-sm text-muted-foreground">
          📅 {new Date(v.date_visite).toLocaleString("fr-TN")}
        </p>
        {v.message && (
          <p className="text-sm text-muted-foreground">💬 {v.message}</p>
        )}
      </div>
    );
  }

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Chargement...</div>
      </div>
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Mes visites</h1>
        <p className="text-sm text-muted-foreground">
          Suivi de vos demandes de visite
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">
              {enAttente.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">En attente</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {confirmees.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Confirmées</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-destructive">
              {annulees.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Annulées</p>
          </CardContent>
        </Card>
      </div>

      {visites.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <CalendarCheck className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p className="font-medium">Aucune visite demandée</p>
            <Button variant="outline" size="sm" className="mt-3" asChild>
              <a href="/annonces">Chercher un logement</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="en_attente">
          <TabsList>
            <TabsTrigger value="en_attente">
              En attente ({enAttente.length})
            </TabsTrigger>
            <TabsTrigger value="confirmee">
              Confirmées ({confirmees.length})
            </TabsTrigger>
            <TabsTrigger value="annulee">
              Annulées ({annulees.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="en_attente" className="space-y-3 mt-4">
            {enAttente.length === 0 ? (
              <p className="text-sm text-center text-muted-foreground py-6">
                Aucune visite en attente
              </p>
            ) : (
              enAttente.map((v) => <VisiteCard key={v.id} v={v} />)
            )}
          </TabsContent>
          <TabsContent value="confirmee" className="space-y-3 mt-4">
            {confirmees.map((v) => (
              <VisiteCard key={v.id} v={v} />
            ))}
          </TabsContent>
          <TabsContent value="annulee" className="space-y-3 mt-4">
            {annulees.map((v) => (
              <VisiteCard key={v.id} v={v} />
            ))}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
