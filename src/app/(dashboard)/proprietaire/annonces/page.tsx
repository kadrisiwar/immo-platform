"use client";

import { useState } from "react";
import { Eye, CheckCircle, XCircle, Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAdminAnnonces, useModererAnnonce } from "@/hooks/use-annonces";

type AnnonceStatus = "active" | "en_moderation" | "rejetee" | "suspendue";

function StatusBadge({ status }: { status: AnnonceStatus }) {
  const map = {
    active: {
      label: "Active",
      cls: "bg-green-100 text-green-800 hover:bg-green-100",
    },
    en_moderation: {
      label: "En modération",
      cls: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    },
    rejetee: {
      label: "Rejetée",
      cls: "bg-red-100 text-red-800 hover:bg-red-100",
    },
    suspendue: {
      label: "Suspendue",
      cls: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    },
  };
  return <Badge className={map[status]?.cls}>{map[status]?.label}</Badge>;
}

export default function AdminAnnoncesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("tous");
  const [selected, setSelected] = useState<any | null>(null);

  const { data: annonces = [], isLoading } = useAdminAnnonces();
  const moderer = useModererAnnonce();

  const filtered = annonces.filter((a) => {
    const matchSearch =
      a.titre.toLowerCase().includes(search.toLowerCase()) ||
      a.proprietaire_nom.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "tous" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleModerer = (id: number, status: string) => {
    moderer.mutate({ id, status });
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Chargement...</div>
      </div>
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Modération des annonces
        </h1>
        <p className="text-sm text-muted-foreground">
          {annonces.length} annonces au total
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {annonces.filter((a) => a.status === "active").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Actives</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">
              {annonces.filter((a) => a.status === "en_moderation").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">En modération</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-destructive">
              {annonces.filter((a) => a.status === "rejetee").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Rejetées</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-500">
              {annonces.filter((a) => a.status === "suspendue").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Suspendues</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Annonces</CardTitle>
          <CardDescription>
            Approuvez ou rejetez les annonces en attente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filtres */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="en_moderation">En modération</SelectItem>
                <SelectItem value="rejetee">Rejetée</SelectItem>
                <SelectItem value="suspendue">Suspendue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tableau */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Annonce</TableHead>
                <TableHead>Propriétaire</TableHead>
                <TableHead>Ville</TableHead>
                <TableHead>Loyer</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.titre}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {a.proprietaire_nom}
                  </TableCell>
                  <TableCell className="text-sm">{a.ville}</TableCell>
                  <TableCell className="font-medium">{a.loyer} DT</TableCell>
                  <TableCell>
                    <StatusBadge status={a.status as AnnonceStatus} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(a.created_at).toLocaleDateString("fr-TN")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {/* Voir détails */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelected(a)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Détails annonce</DialogTitle>
                            <DialogDescription>
                              Informations complètes
                            </DialogDescription>
                          </DialogHeader>
                          {selected && (
                            <div className="space-y-3 pt-2 text-sm">
                              <p className="font-medium text-base">
                                {selected.titre}
                              </p>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <span className="text-muted-foreground">
                                    Propriétaire:
                                  </span>
                                  <p>{selected.proprietaire_nom}</p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">
                                    Ville:
                                  </span>
                                  <p>{selected.ville}</p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">
                                    Loyer:
                                  </span>
                                  <p>{selected.loyer} DT</p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">
                                    Surface:
                                  </span>
                                  <p>{selected.surface}m²</p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">
                                    Pièces:
                                  </span>
                                  <p>{selected.nb_pieces}</p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">
                                    Type:
                                  </span>
                                  <p className="capitalize">
                                    {selected.type_bien}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">
                                    Statut:
                                  </span>
                                  <p>
                                    <StatusBadge status={selected.status} />
                                  </p>
                                </div>
                              </div>
                              {selected.description && (
                                <div>
                                  <span className="text-muted-foreground">
                                    Description:
                                  </span>
                                  <p className="mt-1 text-muted-foreground">
                                    {selected.description}
                                  </p>
                                </div>
                              )}
                              {selected.status === "en_moderation" && (
                                <div className="flex gap-2 pt-2">
                                  <Button
                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                    onClick={() =>
                                      handleModerer(selected.id, "active")
                                    }
                                    disabled={moderer.isPending}
                                  >
                                    <CheckCircle className="mr-2 h-4 w-4" />{" "}
                                    Approuver
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    className="flex-1"
                                    onClick={() =>
                                      handleModerer(selected.id, "rejetee")
                                    }
                                    disabled={moderer.isPending}
                                  >
                                    <XCircle className="mr-2 h-4 w-4" /> Rejeter
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      {/* Approuver / Rejeter direct */}
                      {a.status === "en_moderation" && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-green-600 hover:text-green-600"
                            onClick={() => handleModerer(a.id, "active")}
                            disabled={moderer.isPending}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleModerer(a.id, "rejetee")}
                            disabled={moderer.isPending}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-muted-foreground py-8"
                  >
                    Aucune annonce trouvée
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
