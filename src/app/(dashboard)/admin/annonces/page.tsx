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

type AnnonceStatus = "active" | "en_moderation" | "rejetee";

interface Annonce {
  id: number;
  titre: string;
  proprietaire: string;
  ville: string;
  loyer: string;
  surface: string;
  pieces: number;
  status: AnnonceStatus;
  date: string;
}

const ANNONCES: Annonce[] = [
  {
    id: 1,
    titre: "Appart 3 pièces - Lac 2",
    proprietaire: "Sami Ben Ali",
    ville: "Tunis",
    loyer: "900 DT",
    surface: "85m²",
    pieces: 3,
    status: "active",
    date: "01/04/2026",
  },
  {
    id: 2,
    titre: "Studio meublé - Manar",
    proprietaire: "Karim Mansour",
    ville: "Ariana",
    loyer: "450 DT",
    surface: "35m²",
    pieces: 1,
    status: "en_moderation",
    date: "31/03/2026",
  },
  {
    id: 3,
    titre: "Villa - La Marsa",
    proprietaire: "Youssef Chaabane",
    ville: "La Marsa",
    loyer: "2500 DT",
    surface: "300m²",
    pieces: 6,
    status: "active",
    date: "30/03/2026",
  },
  {
    id: 4,
    titre: "Duplex - El Menzah 6",
    proprietaire: "Sami Ben Ali",
    ville: "Tunis",
    loyer: "1200 DT",
    surface: "120m²",
    pieces: 4,
    status: "rejetee",
    date: "29/03/2026",
  },
  {
    id: 5,
    titre: "Appart 2 pièces - Ennasr",
    proprietaire: "Bilel Hamdi",
    ville: "Ariana",
    loyer: "650 DT",
    surface: "65m²",
    pieces: 2,
    status: "en_moderation",
    date: "28/03/2026",
  },
  {
    id: 6,
    titre: "Studio - Centre Ville",
    proprietaire: "Amira Sassi",
    ville: "Tunis",
    loyer: "500 DT",
    surface: "40m²",
    pieces: 1,
    status: "active",
    date: "27/03/2026",
  },
];

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
  };
  return <Badge className={map[status].cls}>{map[status].label}</Badge>;
}

export default function AdminAnnoncesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("tous");
  const [selected, setSelected] = useState<Annonce | null>(null);

  const filtered = ANNONCES.filter((a) => {
    const matchSearch =
      a.titre.toLowerCase().includes(search.toLowerCase()) ||
      a.proprietaire.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "tous" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Modération des annonces
        </h1>
        <p className="text-sm text-muted-foreground">
          {ANNONCES.length} annonces au total
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {ANNONCES.filter((a) => a.status === "active").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Annonces actives
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">
              {ANNONCES.filter((a) => a.status === "en_moderation").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              En attente de modération
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-destructive">
              {ANNONCES.filter((a) => a.status === "rejetee").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Annonces rejetées
            </p>
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
              </SelectContent>
            </Select>
          </div>

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
                    {a.proprietaire}
                  </TableCell>
                  <TableCell className="text-sm">{a.ville}</TableCell>
                  <TableCell className="font-medium">{a.loyer}</TableCell>
                  <TableCell>
                    <StatusBadge status={a.status} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {a.date}
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
                                    Propriétaire:
                                  </span>
                                  <p>{selected.proprietaire}</p>
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
                                  <p>{selected.loyer}</p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">
                                    Surface:
                                  </span>
                                  <p>{selected.surface}</p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">
                                    Pièces:
                                  </span>
                                  <p>{selected.pieces}</p>
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
                              {selected.status === "en_moderation" && (
                                <div className="flex gap-2 pt-2">
                                  <Button className="flex-1 bg-green-600 hover:bg-green-700">
                                    <CheckCircle className="mr-2 h-4 w-4" />{" "}
                                    Approuver
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    className="flex-1"
                                  >
                                    <XCircle className="mr-2 h-4 w-4" /> Rejeter
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      {a.status === "en_moderation" && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-green-600 hover:text-green-600"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
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
