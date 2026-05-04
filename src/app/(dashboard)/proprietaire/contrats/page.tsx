"use client";

import { useState, useEffect } from "react";
import { FileText, Download, Plus, Printer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useContratsProprietaire } from "@/hooks/use-contrats";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import api from "@/lib/api";

export default function ProprietaireContratsPage() {
  const qc = useQueryClient();
  const { data: contrats = [], isLoading } = useContratsProprietaire();

  // جلب الإعلانات النشطة مباشرة
  const [annonces, setAnnonces] = useState<any[]>([]);
  const [locataires, setLocataires] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [genOpen, setGenOpen] = useState(false);
  const [genForm, setGenForm] = useState({
    annonce: "",
    locataire: "",
    type_contrat: "location",
    date_debut: "",
    date_fin: "",
    caution: "",
  });

  // جلب البيانات عند فتح النافذة
  useEffect(() => {
    if (!genOpen) return;
    setLoadingData(true);
    Promise.all([
      api.get("/annonces/mes-annonces/"),
      api.get("/accounts/locataires/")
    ])
      .then(([annoncesRes, locatairesRes]) => {
        const actives = annoncesRes.data.filter((a: any) => a.status === "active");
        setAnnonces(actives);
        setLocataires(locatairesRes.data);
      })
      .catch(console.error)
      .finally(() => setLoadingData(false));
  }, [genOpen]);

  const generer = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post("/contrats/generer/", data);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["contrats-proprietaire"] });
      setGenOpen(false);
      setGenForm({ annonce: "", locataire: "", type_contrat: "location", date_debut: "", date_fin: "", caution: "" });
    },
    onError: (err: any) => {
      console.error("Erreur génération contrat:", err);
      const errorMessage = err?.response?.data?.error || err?.message || "Erreur génération contrat";
      alert(errorMessage);
    },
  });

  const handleGenerer = () => {
    if (!genForm.annonce || !genForm.locataire || !genForm.date_debut || !genForm.date_fin) {
      alert("Veuillez remplir tous les champs");
      return;
    }
    generer.mutate({
      annonce: Number(genForm.annonce),
      locataire: Number(genForm.locataire),
      type_contrat: genForm.type_contrat,
      date_debut: genForm.date_debut,
      date_fin: genForm.date_fin,
      caution: Number(genForm.caution) || 0,
    });
  };

  // دالة تحميل PDF
  const downloadPdf = async (id: number) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("Vous n'êtes pas connecté");
        return;
      }
      const url = `http://localhost:8000/api/contrats/${id}/pdf/`;
      console.log("Tentative de téléchargement:", url);

      const res = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Erreur réponse:", res.status, errorText);
        throw new Error(`Erreur ${res.status}`);
      }

      const blob = await res.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `contrat_${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
      
      console.log("Téléchargement réussi!");
    } catch (error) {
      console.error("Erreur détaillée:", error);
      alert("Erreur téléchargement PDF. Vérifiez la console (F12) pour plus de détails.");
    }
  };

  // دالة طباعة PDF
  const printContrat = async (id: number) => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`http://localhost:8000/api/contrats/${id}/pdf/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const printWindow = window.open(url, "_blank");
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
      URL.revokeObjectURL(url);
    } catch {
      alert("Erreur lors de l'impression");
    }
  };

  if (isLoading) return <div className="text-center p-6">Chargement contrats...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Mes contrats</h1>
          <p className="text-muted-foreground">Gérez vos contrats de location</p>
        </div>
        <Dialog open={genOpen} onOpenChange={setGenOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Générer un contrat
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Générer un contrat</DialogTitle>
              <DialogDescription>
                Remplissez les informations pour générer un contrat de location, vente ou achat.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              {/* Annonce */}
              <div>
                <Label>Annonce *</Label>
                <Select 
                  value={genForm.annonce} 
                  onValueChange={(v) => setGenForm({ ...genForm, annonce: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={annonces.length === 0 ? "Aucune annonce active" : "Choisir une annonce"} />
                  </SelectTrigger>
                  <SelectContent>
                    {annonces.map((a) => (
                      <SelectItem key={a.id} value={String(a.id)}>
                        {a.titre} - {a.loyer} DT
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {annonces.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">Aucune annonce active. Créez une annonce et faites-la approuver.</p>
                )}
              </div>

              {/* Type de contrat */}
              <div className="space-y-1">
                <Label>Type de contrat</Label>
                <Select
                  value={genForm.type_contrat}
                  onValueChange={(v) => setGenForm({ ...genForm, type_contrat: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="location">📋 Contrat de location</SelectItem>
                    <SelectItem value="vente">🏷️ Contrat de vente</SelectItem>
                    <SelectItem value="achat">🔑 Contrat d'achat</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Locataire */}
              <div>
                <Label>Locataire *</Label>
                <Select 
                  value={genForm.locataire} 
                  onValueChange={(v) => setGenForm({ ...genForm, locataire: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={loadingData ? "Chargement..." : (locataires.length === 0 ? "Aucun locataire" : "Choisir un locataire")} />
                  </SelectTrigger>
                  <SelectContent>
                    {locataires.map((l) => (
                      <SelectItem key={l.id} value={String(l.id)}>
                        {l.username} - {l.email || "sans email"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {locataires.length === 0 && !loadingData && (
                  <p className="text-xs text-red-500 mt-1">Aucun locataire inscrit. Ajoutez-en un depuis Django admin.</p>
                )}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Date début *</Label>
                  <Input type="date" value={genForm.date_debut} onChange={e => setGenForm({ ...genForm, date_debut: e.target.value })} />
                </div>
                <div>
                  <Label>Date fin *</Label>
                  <Input type="date" value={genForm.date_fin} onChange={e => setGenForm({ ...genForm, date_fin: e.target.value })} />
                </div>
              </div>

              {/* Caution */}
              <div>
                <Label>Caution (DT)</Label>
                <Input type="number" placeholder="1800" value={genForm.caution} onChange={e => setGenForm({ ...genForm, caution: e.target.value })} />
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setGenOpen(false)}>Annuler</Button>
                <Button className="flex-1" onClick={handleGenerer} disabled={generer.isPending || !genForm.annonce || !genForm.locataire || !genForm.date_debut || !genForm.date_fin}>
                  {generer.isPending ? "Génération..." : "Générer"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-green-600">{contrats.filter(c => c.status === "signe").length}</div><p>Signés</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-yellow-600">{contrats.filter(c => c.status === "en_attente").length}</div><p>En attente</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-gray-500">{contrats.filter(c => c.status === "expire").length}</div><p>Expirés</p></CardContent></Card>
      </div>

      {/* Tableau des contrats */}
      <Card>
        <CardHeader><CardTitle>Liste des contrats</CardTitle></CardHeader>
        <CardContent>
          {contrats.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p>Aucun contrat généré</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Locataire</TableHead>
                  <TableHead>Annonce</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Période</TableHead>
                  <TableHead>Loyer</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contrats.map((c: any) => (
                  <TableRow key={c.id}>
                    <TableCell>{c.locataire_nom}</TableCell>
                    <TableCell>{c.annonce_titre}</TableCell>
                    <TableCell>{c.type_contrat_label || c.type_contrat}</TableCell>
                    <TableCell>{c.date_debut} → {c.date_fin}</TableCell>
                    <TableCell>{c.loyer_mensuel} DT</TableCell>
                    <TableCell><Badge>{c.status === "signe" ? "Signé" : "En attente"}</Badge></TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => downloadPdf(c.id)} title="Télécharger PDF">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => printContrat(c.id)} title="Imprimer">
                          <Printer className="h-4 w-4" />
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