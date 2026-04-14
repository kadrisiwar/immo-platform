"use client";

import { FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useContratsProprietaire } from "@/hooks/use-contrats";

type ContratStatus = "en_attente" | "signe" | "expire";

function StatusBadge({ status }: { status: ContratStatus }) {
  const map = {
    en_attente: {
      label: "En attente",
      cls: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    },
    signe: {
      label: "Signé",
      cls: "bg-green-100 text-green-800 hover:bg-green-100",
    },
    expire: {
      label: "Expiré",
      cls: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    },
  };
  return <Badge className={map[status]?.cls}>{map[status]?.label}</Badge>;
}

export default function ProprietaireContratsPage() {
  const { data: contrats = [], isLoading } = useContratsProprietaire();

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Chargement...</div>
      </div>
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Mes contrats</h1>
        <p className="text-sm text-muted-foreground">
          Gérez vos contrats de location
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {contrats.filter((c) => c.status === "signe").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Signés</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">
              {contrats.filter((c) => c.status === "en_attente").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">En attente</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-muted-foreground">
              {contrats.filter((c) => c.status === "expire").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Expirés</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tous les contrats</CardTitle>
          <CardDescription>Historique de vos contrats</CardDescription>
        </CardHeader>
        <CardContent>
          {contrats.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p>Aucun contrat pour le moment</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Locataire</TableHead>
                  <TableHead>Annonce</TableHead>
                  <TableHead>Période</TableHead>
                  <TableHead>Loyer</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contrats.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">
                      {c.locataire_nom}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {c.annonce_titre}
                    </TableCell>
                    <TableCell className="text-sm">
                      {c.date_debut} → {c.date_fin}
                    </TableCell>
                    <TableCell className="font-medium">
                      {c.loyer_mensuel} DT
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={c.status} />
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
