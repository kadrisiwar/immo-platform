"use client";

import { useState } from "react";
import { Eye, CheckCircle, Clock } from "lucide-react";
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

type LitigeStatus = "ouvert" | "en_traitement" | "resolu";
type LitigeType = "paiement" | "etat_logement" | "contrat" | "autre";

interface Litige {
  id: number;
  type: LitigeType;
  description: string;
  plaignant: number;
  plaignant_nom: string;
  accuse: number;
  accuse_nom: string;
  status: LitigeStatus;
  created_at: string;
}

function StatusBadge({ status }: { status: LitigeStatus }) {
  const map = {
    ouvert: {
      label: "Ouvert",
      cls: "bg-red-100 text-red-800 hover:bg-red-100",
    },
    en_traitement: {
      label: "En traitement",
      cls: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    },
    resolu: {
      label: "Résolu",
      cls: "bg-green-100 text-green-800 hover:bg-green-100",
    },
  };
  return <Badge className={map[status]?.cls}>{map[status]?.label}</Badge>;
}

function TypeBadge({ type }: { type: LitigeType }) {
  const map = {
    paiement: "Paiement",
    etat_logement: "État logement",
    contrat: "Contrat",
    autre: "Autre",
  };
  return <Badge variant="outline">{map[type]}</Badge>;
}

export default function AdminLitigesPage() {
  const [statusFilter, setStatusFilter] = useState("tous");
  const [selected, setSelected] = useState<Litige | null>(null);
  const queryClient = useQueryClient();

  const { data: litiges = [], isLoading } = useQuery({
    queryKey: ["admin-litiges"],
    queryFn: async () => {
      const res = await api.get("/litiges/");
      return res.data as Litige[];
    },
  });

  const gerer = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await api.patch(`/litiges/${id}/`, { status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-litiges"] });
    },
  });

  const filtered = litiges.filter(
    (l) => statusFilter === "tous" || l.status === statusFilter
  );

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
          Gestion des litiges
        </h1>
        <p className="text-sm text-muted-foreground">
          Traitez les signalements entre utilisateurs
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-destructive">
              {litiges.filter((l) => l.status === "ouvert").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Ouverts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">
              {litiges.filter((l) => l.status === "en_traitement").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">En traitement</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {litiges.filter((l) => l.status === "resolu").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Résolus</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Litiges signalés</CardTitle>
            <CardDescription>
              Gérez les conflits entre utilisateurs
            </CardDescription>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Tous</SelectItem>
              <SelectItem value="ouvert">Ouverts</SelectItem>
              <SelectItem value="en_traitement">En traitement</SelectItem>
              <SelectItem value="resolu">Résolus</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {litiges.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Aucun litige pour le moment</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Plaignant</TableHead>
                  <TableHead>Accusé</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell>
                      <TypeBadge type={l.type} />
                    </TableCell>
                    <TableCell className="text-sm max-w-48 truncate">
                      {l.description}
                    </TableCell>
                    <TableCell className="text-sm">{l.plaignant_nom}</TableCell>
                    <TableCell className="text-sm">{l.accuse_nom}</TableCell>
                    <TableCell>
                      <StatusBadge status={l.status} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(l.created_at).toLocaleDateString("fr-TN")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelected(l)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Détails du litige</DialogTitle>
                              <DialogDescription>
                                Informations complètes
                              </DialogDescription>
                            </DialogHeader>
                            {selected && (
                              <div className="space-y-4 pt-2 text-sm">
                                <div className="flex gap-2">
                                  <TypeBadge type={selected.type} />
                                  <StatusBadge status={selected.status} />
                                </div>
                                <p className="text-muted-foreground">
                                  {selected.description}
                                </p>
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <span className="text-muted-foreground">
                                      Plaignant:
                                    </span>
                                    <p className="font-medium">
                                      {selected.plaignant_nom}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">
                                      Accusé:
                                    </span>
                                    <p className="font-medium">
                                      {selected.accuse_nom}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">
                                      Date:
                                    </span>
                                    <p>
                                      {new Date(
                                        selected.created_at
                                      ).toLocaleDateString("fr-TN")}
                                    </p>
                                  </div>
                                </div>
                                {selected.status !== "resolu" && (
                                  <div className="flex gap-2 pt-2">
                                    {selected.status === "ouvert" && (
                                      <Button
                                        className="flex-1"
                                        variant="outline"
                                        onClick={() =>
                                          gerer.mutate({
                                            id: selected.id,
                                            status: "en_traitement",
                                          })
                                        }
                                        disabled={gerer.isPending}
                                      >
                                        <Clock className="mr-2 h-4 w-4" />{" "}
                                        Prendre en charge
                                      </Button>
                                    )}
                                    <Button
                                      className="flex-1"
                                      style={{
                                        backgroundColor: "#16a34a",
                                        color: "white",
                                      }}
                                      onClick={() =>
                                        gerer.mutate({
                                          id: selected.id,
                                          status: "resolu",
                                        })
                                      }
                                      disabled={gerer.isPending}
                                    >
                                      <CheckCircle className="mr-2 h-4 w-4" />{" "}
                                      Marquer résolu
                                    </Button>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        {l.status !== "resolu" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-green-600 hover:text-green-600"
                            onClick={() =>
                              gerer.mutate({ id: l.id, status: "resolu" })
                            }
                            disabled={gerer.isPending}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
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
                      Aucun litige trouvé
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
