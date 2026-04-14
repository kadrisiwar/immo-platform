"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  MapPin,
  BedDouble,
  Maximize2,
  Heart,
  Share2,
  Phone,
  Mail,
  CalendarCheck,
  ChevronLeft,
  Home,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAnnonce } from "@/hooks/use-annonces";
import { useDemanderVisite } from "@/hooks/use-visites";
import Link from "next/link";

export default function AnnonceDetailPage() {
  const { id } = useParams();
  const { data: annonce, isLoading } = useAnnonce(Number(id));
  const demanderVisite = useDemanderVisite();

  const [isFavorite, setIsFavorite] = useState(false);
  const [dateVisite, setDateVisite] = useState("");
  const [message, setMessage] = useState("");
  const [visiteEnvoyee, setVisiteEnvoyee] = useState(false);
  const [visiteError, setVisiteError] = useState("");

  const handleDemanderVisite = () => {
    if (!dateVisite) return;
    setVisiteError("");
    demanderVisite.mutate(
      {
        annonce: Number(id),
        date_visite: new Date(dateVisite).toISOString(),
        message: message,
      },
      {
        onSuccess: () => setVisiteEnvoyee(true),
        onError: (error: any) => {
          const msg =
            error?.response?.data?.detail ||
            "Erreur. Vérifiez que vous êtes connecté en tant que locataire.";
          setVisiteError(msg);
        },
      }
    );
  };

  if (isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Chargement...</div>
      </div>
    );

  if (!annonce)
    return (
      <div className="flex min-h-screen items-center justify-center flex-col gap-4">
        <Home className="h-16 w-16 text-muted-foreground opacity-30" />
        <p className="text-lg font-medium">Annonce introuvable</p>
        <Button asChild>
          <Link href="/annonces">Retour aux annonces</Link>
        </Button>
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            🏠 ImmoPlat
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/login">Se connecter</Link>
            </Button>
            <Button asChild>
              <Link href="/register">S&apos;inscrire</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link
            href="/annonces"
            className="flex items-center gap-1 hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" /> Retour aux annonces
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <div className="h-80 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center relative">
              <Home className="h-24 w-24 text-primary/20" />
              <Badge className="absolute top-4 left-4 bg-white text-foreground border">
                {annonce.type_bien}
              </Badge>
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      isFavorite ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                </Button>
                <Button variant="secondary" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Infos */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold">{annonce.titre}</h1>
                  <div className="flex items-center gap-1 text-muted-foreground mt-1">
                    <MapPin className="h-4 w-4" />
                    {annonce.ville}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-3xl font-bold text-primary">
                    {annonce.loyer} DT
                  </div>
                  <div className="text-sm text-muted-foreground">/ mois</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-4 p-4 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <BedDouble className="h-4 w-4 text-primary" />
                  <span>
                    <strong>{annonce.nb_pieces}</strong> pièces
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Maximize2 className="h-4 w-4 text-primary" />
                  <span>
                    <strong>{annonce.surface}</strong> m²
                  </span>
                </div>
                <div className="text-sm capitalize">
                  <strong>{annonce.type_bien}</strong>
                </div>
              </div>
            </div>

            {/* Description */}
            {annonce.description && (
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {annonce.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Adresse */}
            <Card>
              <CardHeader>
                <CardTitle>Localisation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  {annonce.adresse}, {annonce.ville}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Colonne droite */}
          <div className="space-y-4">
            {/* Propriétaire */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Propriétaire</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="font-medium">{annonce.proprietaire_nom}</p>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  size="sm"
                >
                  <Mail className="h-4 w-4" />
                  Envoyer un message
                </Button>
              </CardContent>
            </Card>

            {/* Demande de visite */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Demander une visite</CardTitle>
              </CardHeader>
              <CardContent>
                {visiteEnvoyee ? (
                  <div className="text-center py-4 space-y-2">
                    <CheckCircle className="h-10 w-10 text-green-600 mx-auto" />
                    <p className="font-medium text-green-600">
                      Demande envoyée!
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Le propriétaire vous contactera bientôt.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label>Date et heure souhaitées</Label>
                      <Input
                        type="datetime-local"
                        value={dateVisite}
                        onChange={(e) => setDateVisite(e.target.value)}
                        min={new Date().toISOString().slice(0, 16)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Message (optionnel)</Label>
                      <Textarea
                        placeholder="Présentez-vous brièvement..."
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                    </div>

                    {visiteError && (
                      <p className="text-xs text-destructive">{visiteError}</p>
                    )}

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full" disabled={!dateVisite}>
                          <CalendarCheck className="mr-2 h-4 w-4" />
                          Demander une visite
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirmer la demande</DialogTitle>
                          <DialogDescription>
                            Visite le{" "}
                            <strong>
                              {dateVisite
                                ? new Date(dateVisite).toLocaleString("fr-TN")
                                : ""}
                            </strong>
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex gap-2 pt-2">
                          <Button
                            className="flex-1"
                            onClick={handleDemanderVisite}
                            disabled={demanderVisite.isPending}
                          >
                            {demanderVisite.isPending
                              ? "Envoi..."
                              : "Confirmer"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Infos */}
            <Card>
              <CardContent className="pt-4">
                <div className="text-sm text-muted-foreground">
                  Publié le{" "}
                  {new Date(annonce.created_at).toLocaleDateString("fr-TN")}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
