"use client";

import { useState } from "react";
import { Plus, Eye, Pencil, Trash2, PauseCircle, PlayCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useMesAnnonces, useModifierAnnonce, useSupprimerAnnonce, useSuspendreAnnonce } from "@/hooks/use-annonces";

type AnnonceStatus = "active" | "suspendue" | "en_moderation" | "rejetee";

function StatusBadge({ status }: { status: AnnonceStatus }) {
  const map = {
    active:        { label: "Active",        cls: "bg-green-100 text-green-800 hover:bg-green-100" },
    suspendue:     { label: "Suspendue",     cls: "bg-gray-100 text-gray-800 hover:bg-gray-100" },
    en_moderation: { label: "En modération", cls: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" },
    rejetee:       { label: "Rejetée",       cls: "bg-red-100 text-red-800 hover:bg-red-100" },
  };
  return <Badge className={map[status]?.cls}>{map[status]?.label}</Badge>;
}

export default function ProprietaireAnnoncesPage() {
  const { data: annonces = [], isLoading } = useMesAnnonces();
  const modifier  = useModifierAnnonce();
  const supprimer = useSupprimerAnnonce();
  const suspendre = useSuspendreAnnonce();

  const [selected,    setSelected]    = useState<any | null>(null);
  const [editOpen,    setEditOpen]    = useState(false);
  const [editForm,    setEditForm]    = useState<any>({});

  const openEdit = (a: any) => {
    setEditForm({
      titre:       a.titre,
      description: a.description,
      loyer:       a.loyer,
      surface:     a.surface,
      nb_pieces:   a.nb_pieces,
      ville:       a.ville,
      adresse:     a.adresse,
    });
    setSelected(a);
    setEditOpen(true);
  };

  const handleEdit = () => {
    if (!selected) return;
    modifier.mutate(
      { id: selected.id, data: editForm },
      { onSuccess: () => setEditOpen(false) }
    );
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-muted-foreground">Chargement...</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Mes annonces</h1>
          <p className="text-sm text-muted-foreground">{annonces.length} annonces publiées</p>
        </div>
        <Button asChild>
          <a href="/proprietaire/annonces/nouvelle">
            <Plus className="mr-2 h-4 w-4" /> Nouvelle annonce
          </a>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card><CardContent className="pt-6">
          <div className="text-2xl font-bold">{annonces.length}</div>
          <p className="text-xs text-muted-foreground mt-1">Total</p>
        </CardContent></Card>
        <Card><CardContent className="pt-6">
          <div className="text-2xl font-bold text-green-600">
            {annonces.filter(a => a.status === "active").length}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Actives</p>
        </CardContent></Card>
        <Card><CardContent className="pt-6">
          <div className="text-2xl font-bold text-yellow-600">
            {annonces.filter(a => a.status === "en_moderation").length}
          </div>
          <p className="text-xs text-muted-foreground mt-1">En modération</p>
        </CardContent></Card>
        <Card><CardContent className="pt-6">
          <div className="text-2xl font-bold text-gray-500">
            {annonces.filter(a => a.status === "suspendue").length}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Suspendues</p>
        </CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Toutes mes annonces</CardTitle>
          <CardDescription>Gérez, modifiez et suspendez vos annonces</CardDescription>
        </CardHeader>
        <CardContent>
          {annonces.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Aucune annonce pour le moment</p>
              <Button variant="outline" size="sm" className="mt-3" asChild>
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
                    <TableCell><StatusBadge status={a.status as AnnonceStatus} /></TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(a.created_at).toLocaleDateString("fr-TN")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {/* Voir */}
                        <Button variant="ghost" size="icon" asChild>
                          <a href={`/annonces/${a.id}`} target="_blank">
                            <Eye className="h-4 w-4" />
                          </a>
                        </Button>
                        
                        {/*  Créneaux  */}
                        <Button variant="ghost" size="icon" asChild title="Gérer les créneaux">
                          <a href={`/proprietaire/annonces/${a.id}/creneaux`}>
                          <Clock className="h-4 w-4" />
                          </a>
                          </Button>

                        {/* Modifier */}
                        <Button variant="ghost" size="icon" onClick={() => openEdit(a)}>
                          <Pencil className="h-4 w-4" />
                        </Button>

                        {/* Suspendre / Activer */}
                        {a.status === "active" ? (
                          <Button
                            variant="ghost" size="icon"
                            className="text-orange-500 hover:text-orange-500"
                            onClick={() => suspendre.mutate({ id: a.id, status: "suspendue" })}
                            disabled={suspendre.isPending}
                          >
                            <PauseCircle className="h-4 w-4" />
                          </Button>
                        ) : a.status === "suspendue" ? (
                          <Button
                            variant="ghost" size="icon"
                            className="text-green-600 hover:text-green-600"
                            onClick={() => suspendre.mutate({ id: a.id, status: "active" })}
                            disabled={suspendre.isPending}
                          >
                            <PlayCircle className="h-4 w-4" />
                          </Button>
                        ) : null}

                        {/* Supprimer */}
                        <Button
                          variant="ghost" size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => {
                            if (confirm("Supprimer cette annonce ?")) {
                              supprimer.mutate(a.id);
                            }
                          }}
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

      {/* Dialog Modifier */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Modifier l'annonce</DialogTitle>
            <DialogDescription>Modifiez les informations de votre annonce</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <div className="space-y-1">
              <Label>Titre</Label>
              <Input value={editForm.titre || ""} onChange={e => setEditForm({...editForm, titre: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Loyer (DT)</Label>
                <Input type="number" value={editForm.loyer || ""} onChange={e => setEditForm({...editForm, loyer: e.target.value})} />
              </div>
              <div className="space-y-1">
                <Label>Surface (m²)</Label>
                <Input type="number" value={editForm.surface || ""} onChange={e => setEditForm({...editForm, surface: e.target.value})} />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Ville</Label>
              <Select value={editForm.ville || ""} onValueChange={v => setEditForm({...editForm, ville: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Tunis","Ariana","La Marsa","Carthage","Sfax","Sousse"].map(v => (
                    <SelectItem key={v} value={v}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Description</Label>
              <Textarea rows={3} value={editForm.description || ""} onChange={e => setEditForm({...editForm, description: e.target.value})} />
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setEditOpen(false)}>Annuler</Button>
              <Button className="flex-1" onClick={handleEdit} disabled={modifier.isPending}>
                {modifier.isPending ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}