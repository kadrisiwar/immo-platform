"use client";

import { useState } from "react";
import { Plus, Eye, Pencil, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMesAnnonces, useSupprimerAnnonce } from "@/hooks/use-annonces";

type AnnonceStatus = "active" | "suspendue" | "en_moderation" | "rejetee";

function StatusBadge({ status }: { status: AnnonceStatus }) {
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

export default function ProprietaireAnnoncesPage() {
  const { data: annonces = [], isLoading } = useMesAnnonces();
  const supprimer = useSupprimerAnnonce();
  const [selected, setSelected] = useState<any | null>(null);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Chargement...</div>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Mes annonces
          </h1>
          <p className="text-sm text-muted-foreground">
            {annonces.length} annonces publiées
          </p>
        </div>
        <Button asChild>
          <a href="/proprietaire/annonces/nouvelle">
            <Plus className="mr-2 h-4 w-4" /> Nouvelle annonce
          </a>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{annonces.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Total annonces</p>
          </CardContent>
        </Card>
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
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Toutes mes annonces</CardTitle>
          <CardDescription>Gérez et suivez vos annonces</CardDescription>
        </CardHeader>
        <CardContent>
          {annonces.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="font-medium">Aucune annonce pour le moment</p>
              <p className="text-sm mt-1">Créez votre première annonce</p>
              <Button className="mt-4" asChild>
                <a href="/proprietaire/annonces/nouvelle">Créer une annonce</a>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Annonce</TableHead>
                  <TableHead>Loyer</TableHead>
                  <TableHead>Ville</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {annonces.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{a.titre}</p>
                        <p className="text-xs text-muted-foreground">
                          {a.surface}m² · {a.nb_pieces} pièces
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{a.loyer} DT</TableCell>
                    <TableCell className="text-sm">{a.ville}</TableCell>
                    <TableCell>
                      <StatusBadge status={a.status as AnnonceStatus} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(a.created_at).toLocaleDateString("fr-TN")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
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
                                    <p className="mt-1">
                                      {selected.description}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => supprimer.mutate(a.id)}
                          disabled={supprimer.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
