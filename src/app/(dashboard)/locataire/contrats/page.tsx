"use client";

import { FileText, CheckCircle } from "lucide-react";
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
import { useContratsLocataire, useSignerContrat } from "@/hooks/use-contrats";

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

export default function LocataireContratsPage() {
  const { data: contrats = [], isLoading } = useContratsLocataire();
  const signer = useSignerContrat();

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
          Vos contrats de location
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tous mes contrats</CardTitle>
          <CardDescription>Signez vos contrats en attente</CardDescription>
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
                  <TableHead>Annonce</TableHead>
                  <TableHead>Propriétaire</TableHead>
                  <TableHead>Période</TableHead>
                  <TableHead>Loyer</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contrats.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">
                      {c.annonce_titre}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {c.proprietaire_nom}
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
                    <TableCell className="text-right">
                      {c.status === "en_attente" && (
                        <Button
                          size="sm"
                          style={{ backgroundColor: "#16a34a", color: "white" }}
                          onClick={() => signer.mutate(c.id)}
                          disabled={signer.isPending}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Signer
                        </Button>
                      )}
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
