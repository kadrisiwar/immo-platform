"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  MapPin, BedDouble, Maximize2, Heart, Share2,
  CalendarCheck, ChevronLeft, Home, CheckCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAnnonce, useCreneauxAnnonce } from "@/hooks/use-annonces";
import { useDemanderVisite } from "@/hooks/use-visites";
import { useFavoris, useToggleFavori } from "@/hooks/use-favoris";
import Link from "next/link";
import { MapView } from "@/components/shared/MapView";
import { MessageSquare } from "lucide-react";

export default function AnnonceDetailPage() {
  const { id }                                = useParams();
  const { data: annonce, isLoading }          = useAnnonce(Number(id));
  const { data: creneaux = [] }               = useCreneauxAnnonce(Number(id));
  const { data: favorisIds = [] }             = useFavoris();
  const toggleFavori                          = useToggleFavori();
  const demanderVisite                        = useDemanderVisite();

  const [creneau, setCreneau]                 = useState("");
  const [message, setMessage]                 = useState("");
  const [visiteEnvoyee, setVisiteEnvoyee]     = useState(false);
  const [visiteError, setVisiteError]         = useState("");

  const isFavorite = favorisIds.includes(Number(id));

  const handleDemanderVisite = () => {
    if (!creneau) return;
    setVisiteError("");
    const selectedCreneau = creneaux.find(c => c.id === Number(creneau));
    demanderVisite.mutate(
      {
        annonce:    Number(id),
        date_visite: selectedCreneau?.date_heure || creneau,
        creneau:    Number(creneau),
        message,
      },
      {
        onSuccess: () => setVisiteEnvoyee(true),
        onError:   (err: any) => {
          setVisiteError(
            err?.response?.data?.error ||
            "Erreur. Vérifiez que vous êtes connecté en tant que locataire."
          );
        },
      }
    );
  };

  if (isLoading) return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-muted-foreground">Chargement...</div>
    </div>
  );

  if (!annonce) return (
    <div className="flex min-h-screen items-center justify-center flex-col gap-4">
      <Home className="h-16 w-16 text-muted-foreground opacity-30" />
      <p className="text-lg font-medium">Annonce introuvable</p>
      <Button asChild><Link href="/annonces">Retour</Link></Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">🏠 ImmoPlat</Link>
          <div className="flex gap-2">
            <Button variant="outline" asChild><Link href="/login">Se connecter</Link></Button>
            <Button asChild><Link href="/register">S&apos;inscrire</Link></Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/annonces" className="flex items-center gap-1 hover:text-foreground">
            <ChevronLeft className="h-4 w-4" /> Retour aux annonces
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">

            {/* Images */}
            {annonce.images && annonce.images.length > 0 ? (
              <div className="space-y-2">
                <div className="h-80 rounded-xl overflow-hidden relative">
                  <img
                    src={`http://localhost:8000${annonce.images[0].image}`}
                    alt={annonce.titre}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-white text-foreground border capitalize">
                    {annonce.type_bien}
                  </Badge>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button
                      variant="secondary" size="icon"
                      onClick={() => toggleFavori.mutate(Number(id))}
                    >
                      <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                    </Button>
                  </div>
                </div>
                {annonce.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {annonce.images.slice(1, 5).map((img: any, i: number) => (
                      <div key={i} className="h-20 rounded-lg overflow-hidden">
                        <img src={`http://localhost:8000${img.image}`}
                          alt={`photo ${i + 2}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-80 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center relative">
                <Home className="h-24 w-24 text-primary/20" />
                <Badge className="absolute top-4 left-4 bg-white text-foreground border capitalize">
                  {annonce.type_bien}
                </Badge>
                <Button
                  variant="secondary" size="icon" className="absolute top-4 right-4"
                  onClick={() => toggleFavori.mutate(Number(id))}
                >
                  <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
              </div>
            )}

            {/* Infos */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold">{annonce.titre}</h1>
                  <div className="flex items-center gap-1 text-muted-foreground mt-1">
                    <MapPin className="h-4 w-4" />{annonce.ville}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-3xl font-bold text-primary">{annonce.loyer} DT</div>
                  <div className="text-sm text-muted-foreground">/ mois</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 mt-4 p-4 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <BedDouble className="h-4 w-4 text-primary" />
                  <span><strong>{annonce.nb_pieces}</strong> pièces</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Maximize2 className="h-4 w-4 text-primary" />
                  <span><strong>{annonce.surface}</strong> m²</span>
                </div>
              </div>
            </div>

            {annonce.description && (
              <Card>
                <CardHeader><CardTitle>Description</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{annonce.description}</p>
                </CardContent>
              </Card>
            )}
            {annonce.latitude && annonce.longitude && (
  <Card>
    <CardHeader><CardTitle>Localisation sur la carte</CardTitle></CardHeader>
    <CardContent className="p-0 overflow-hidden rounded-b-lg">
      <MapView
        annonces={[annonce as any]}
        height="280px"
      />
    </CardContent>
  </Card>
)}
          </div>

          {/* Colonne droite */}
          <div className="space-y-4">
            <Card>
  <CardHeader><CardTitle className="text-base">Propriétaire</CardTitle></CardHeader>
  <CardContent className="space-y-3">
    <p className="font-medium">{annonce.proprietaire_nom}</p>
    <Button
      className="w-full"
      onClick={async () => {
        // Créer conversation et rediriger
        const token = localStorage.getItem("access_token");
        if (!token) {
          window.location.href = "/login";
          return;
        }
        try {
          const res = await fetch("http://localhost:8000/api/messagerie/creer/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ annonce: Number(id) }),
          });
          if (res.ok) {
            const data = await res.json();
            // Rediriger selon le rôle
            const payload = JSON.parse(atob(token.split(".")[1]));
            if (payload.role === "locataire") {
              window.location.href = `/locataire/messages`;
            } else {
              window.location.href = `/proprietaire/messages`;
            }
          } else if (res.status === 401) {
            window.location.href = "/login";
          }
        } catch {
          window.location.href = "/login";
        }
      }}
    >
      <MessageSquare className="mr-2 h-4 w-4" />
      Contacter le propriétaire
    </Button>
  </CardContent>
</Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Demander une visite</CardTitle></CardHeader>
              <CardContent>
                {visiteEnvoyee ? (
                  <div className="text-center py-4 space-y-2">
                    <CheckCircle className="h-10 w-10 text-green-600 mx-auto" />
                    <p className="font-medium text-green-600">Demande envoyée!</p>
                    <p className="text-xs text-muted-foreground">Le propriétaire vous contactera bientôt.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Choisir un créneau</label>
                      {creneaux.length > 0 ? (
                        <Select value={creneau} onValueChange={setCreneau}>
                          <SelectTrigger><SelectValue placeholder="Sélectionner une date" /></SelectTrigger>
                          <SelectContent>
                            {creneaux.map(c => (
                              <SelectItem key={c.id} value={String(c.id)}>
                                {new Date(c.date_heure).toLocaleString("fr-TN")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-xs text-muted-foreground border rounded p-2">
                          Aucun créneau disponible pour le moment
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Message (optionnel)</label>
                      <Textarea placeholder="Présentez-vous..." rows={3}
                        value={message} onChange={e => setMessage(e.target.value)} />
                    </div>
                    {visiteError && <p className="text-xs text-destructive">{visiteError}</p>}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full" disabled={!creneau || creneaux.length === 0}>
                          <CalendarCheck className="mr-2 h-4 w-4" />
                          Demander une visite
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirmer la demande</DialogTitle>
                          <DialogDescription>
                            Créneau sélectionné:{" "}
                            <strong>
                              {creneaux.find(c => String(c.id) === creneau)
                                ? new Date(creneaux.find(c => String(c.id) === creneau)!.date_heure)
                                    .toLocaleString("fr-TN")
                                : ""}
                            </strong>
                          </DialogDescription>
                        </DialogHeader>
                        <Button className="w-full" onClick={handleDemanderVisite}
                          disabled={demanderVisite.isPending}>
                          {demanderVisite.isPending ? "Envoi..." : "Confirmer"}
                        </Button>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}