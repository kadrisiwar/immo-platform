"use client";

import { Home, CalendarCheck, Heart, FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useVisitesLocataire } from "@/hooks/use-visites";

export default function LocataireDashboardPage() {
  const { data: visites = [], isLoading } = useVisitesLocataire();

  const enAttente = visites.filter((v) => v.status === "en_attente");
  const confirmees = visites.filter((v) => v.status === "confirmee");

  const STATS = [
    {
      title: "Visites demandées",
      value: visites.length,
      icon: CalendarCheck,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Visites confirmées",
      value: confirmees.length,
      icon: Home,
      color: "bg-green-100 text-green-700",
    },
    {
      title: "En attente",
      value: enAttente.length,
      icon: Heart,
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      title: "Contrats",
      value: 0,
      icon: FileText,
      color: "bg-purple-100 text-purple-700",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Tableau de bord
        </h1>
        <p className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString("fr-TN")}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((s) => (
          <Card key={s.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="text-sm font-medium text-muted-foreground">
                {s.title}
              </div>
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${s.color}`}
              >
                <s.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Mes visites récentes</CardTitle>
            <CardDescription>Statut de vos demandes</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href="/locataire/visites">Voir tout</a>
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4 text-muted-foreground text-sm">
              Chargement...
            </div>
          ) : visites.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CalendarCheck className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Aucune visite demandée</p>
              <Button variant="outline" size="sm" className="mt-3" asChild>
                <a href="/annonces">Chercher un logement</a>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {visites.slice(0, 4).map((v) => (
                <div
                  key={v.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="text-sm font-medium">{v.annonce_titre}</p>
                    <p className="text-xs text-muted-foreground">
                      {v.annonce_ville}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(v.date_visite).toLocaleString("fr-TN")}
                    </p>
                  </div>
                  <Badge
                    className={
                      v.status === "confirmee"
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : v.status === "annulee"
                        ? "bg-red-100 text-red-800 hover:bg-red-100"
                        : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                    }
                  >
                    {v.status === "confirmee"
                      ? "Confirmée"
                      : v.status === "annulee"
                      ? "Annulée"
                      : "En attente"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
