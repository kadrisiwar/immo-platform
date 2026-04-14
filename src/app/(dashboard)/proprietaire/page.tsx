"use client";

import {
  Home,
  CalendarCheck,
  FileText,
  MessageSquare,
  TrendingUp,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMesAnnonces } from "@/hooks/use-annonces";
import { useVisitesProprietaire, useGererVisite } from "@/hooks/use-visites";

type AnnonceStatus = "active" | "suspendue" | "en_moderation" | "rejetee";

function AnnonceStatusBadge({ status }: { status: AnnonceStatus }) {
  const map = {
    active: {
      label: "Active",
      cls: "bg-green-100 text-green-800 hover:bg-green-100",
    },
    suspendue: {
      label: "Suspendue",
      cls: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    },
    en_moderation: {
      label: "En modération",
      cls: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    },
    rejetee: {
      label: "Rejetée",
      cls: "bg-red-100 text-red-800 hover:bg-red-100",
    },
  };
  return <Badge className={map[status]?.cls}>{map[status]?.label}</Badge>;
}

export default function ProprietaireDashboardPage() {
  const { data: annonces = [], isLoading: loadingAnnonces } = useMesAnnonces();
  const { data: visites = [], isLoading: loadingVisites } =
    useVisitesProprietaire();
  const gerer = useGererVisite();

  const visiteEnAttente = visites.filter((v) => v.status === "en_attente");

  const STATS = [
    {
      title: "Mes annonces",
      value: annonces.length,
      change: "publiées",
      icon: Home,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Visites en attente",
      value: visiteEnAttente.length,
      change: "à confirmer",
      icon: CalendarCheck,
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      title: "Annonces actives",
      value: annonces.filter((a) => a.status === "active").length,
      change: "en ligne",
      icon: FileText,
      color: "bg-green-100 text-green-700",
    },
    {
      title: "En modération",
      value: annonces.filter((a) => a.status === "en_moderation").length,
      change: "en attente",
      icon: MessageSquare,
      color: "bg-red-100 text-red-700",
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

      {/* Stats */}
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
              <p className="text-xs text-muted-foreground mt-1">{s.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Mes annonces */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Mes annonces</CardTitle>
              <CardDescription>Performance de vos annonces</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href="/proprietaire/annonces">Voir tout</a>
            </Button>
          </CardHeader>
          <CardContent>
            {loadingAnnonces ? (
              <div className="text-center py-4 text-muted-foreground text-sm">
                Chargement...
              </div>
            ) : annonces.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground text-sm">
                Aucune annonce
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Annonce</TableHead>
                    <TableHead>Loyer</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {annonces.slice(0, 4).map((a) => (
                    <TableRow key={a.id}>
                      <TableCell>
                        <p className="font-medium text-sm">{a.titre}</p>
                        <p className="text-xs text-muted-foreground">
                          {a.ville} · {a.surface}m²
                        </p>
                      </TableCell>
                      <TableCell className="text-sm">{a.loyer} DT</TableCell>
                      <TableCell>
                        <AnnonceStatusBadge
                          status={a.status as AnnonceStatus}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Visites en attente */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Visites en attente</CardTitle>
              <CardDescription>Demandes à confirmer</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href="/proprietaire/visites">Voir tout</a>
            </Button>
          </CardHeader>
          <CardContent>
            {loadingVisites ? (
              <div className="text-center py-4 text-muted-foreground text-sm">
                Chargement...
              </div>
            ) : visiteEnAttente.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground text-sm">
                Aucune visite en attente
              </div>
            ) : (
              <div className="space-y-3">
                {visiteEnAttente.slice(0, 3).map((v) => (
                  <div
                    key={v.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{v.locataire_nom}</p>
                      <p className="text-xs text-muted-foreground">
                        {v.annonce_titre}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(v.date_visite).toLocaleString("fr-TN")}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        style={{ backgroundColor: "#16a34a", color: "white" }}
                        onClick={() =>
                          gerer.mutate({ id: v.id, status: "confirmee" })
                        }
                        disabled={gerer.isPending}
                      >
                        ✓
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          gerer.mutate({ id: v.id, status: "annulee" })
                        }
                        disabled={gerer.isPending}
                      >
                        ✗
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
