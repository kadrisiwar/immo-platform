"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  MapPin, BedDouble, Maximize2, Heart,
  CalendarCheck, ChevronLeft, Home,
  CheckCircle, Lock, MessageSquare,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAnnonce, useCreneauxAnnonce } from "@/hooks/use-annonces";
import { useDemanderVisite } from "@/hooks/use-visites";
import { useFavoris, useToggleFavori } from "@/hooks/use-favoris";
import { AvisSection } from "@/components/shared/AvisSection";
import Link from "next/link";

// Détecter le rôle depuis localStorage
function useCurrentUser() {
  const [user, setUser] = useState<{
    id: number; role: string; username: string;
  } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser({
        id:       payload.user_id,
        role:     payload.role,
        username: payload.username,
      });
    } catch {}
  }, []);

  return user;
}

export default function AnnonceDetailPage() {
  const { id }                        = useParams();
  const { data: annonce, isLoading }  = useAnnonce(Number(id));
  const { data: creneaux = [] }       = useCreneauxAnnonce(Number(id));
  const { data: favorisIds = [] }     = useFavoris();
  const toggleFavori                  = useToggleFavori();
  const demanderVisite                = useDemanderVisite();
  const currentUser                   = useCurrentUser();

  const [creneau, setCreneau]             = useState("");
  const [dateLibre, setDateLibre]         = useState("");
  const [message, setMessage]             = useState("");
  const [visiteEnvoyee, setVisiteEnvoyee] = useState(false);
  const [visiteError, setVisiteError]     = useState("");

  const isFavorite   = favorisIds.includes(Number(id));
  const isLocataire  = currentUser?.role === "locataire";
  const isConnected  = !!currentUser;

  const handleDemanderVisite = () => {
    setVisiteError("");

    // Date finale — créneau ou date libre
    let dateFinale = dateLibre;
    let creneauId: number | undefined;

    if (creneau && creneau !== "libre") {
      const selectedCreneau = creneaux.find(c => String(c.id) === creneau);
      dateFinale  = selectedCreneau?.date_heure || dateLibre;
      creneauId   = Number(creneau);
    }

    if (!dateFinale) {
      setVisiteError("Veuillez sélectionner une date.");
      return;
    }

    demanderVisite.mutate(
      {
        annonce:    Number(id),
        date_visite: dateFinale,
        creneau:    creneauId,
        message,
      },
      {
        onSuccess: () => setVisiteEnvoyee(true),
        onError:   (err: any) => {
          const msg =
            err?.response?.data?.error ||
            err?.response?.data?.detail ||
            "Erreur. Vérifiez votre connexion.";
          setVisiteError(msg);
        },
      }
    );
  };

  if (isLoading) return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
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

      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">🏠 ImmoPlat</Link>
          <div className="flex gap-2">
            {!isConnected ? (
              <>
                <Button variant="outline" asChild>
                  <Link href="/login">Se connecter</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">S&apos;inscrire</Link>
                </Button>
              </>
            ) : (
              <Button variant="outline" asChild>
                <Link href={`/${currentUser.role}`}>Mon espace</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/annonces" className="flex items-center gap-1 hover:text-foreground">
            <ChevronLeft className="h-4 w-4" /> Retour aux annonces
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">

          {/* ── Colonne principale ── */}
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
                  <Button
                    variant="secondary" size="icon"
                    className="absolute top-4 right-4"
                    onClick={() => toggleFavori.mutate(Number(id))}
                  >
                    <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                  </Button>
                </div>
                {annonce.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {annonce.images.slice(1, 5).map((img: any, i: number) => (
                      <div key={i} className="h-20 rounded-lg overflow-hidden">
                        <img
                          src={`http://localhost:8000${img.image}`}
                          alt={`photo ${i + 2}`}
                          className="w-full h-full object-cover"
                        />
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
                  variant="secondary" size="icon"
                  className="absolute top-4 right-4"
                  onClick={() => toggleFavori.mutate(Number(id))}
                >
                  <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
              </div>
            )}

            {/* Titre + prix */}
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
                <Badge variant="outline" className="capitalize">{annonce.type_bien}</Badge>
              </div>
            </div>

            {/* Description */}
            {annonce.description && (
              <Card>
                <CardHeader><CardTitle>Description</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {annonce.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Localisation */}
            <Card>
              <CardHeader><CardTitle>Localisation</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  {annonce.adresse}, {annonce.ville}
                </div>
              </CardContent>
            </Card>

            {/* Avis */}
            <AvisSection annonceId={Number(id)} />
          </div>

          {/* ── Colonne droite ── */}
          <div className="space-y-4">

            {/* Propriétaire */}
            <Card>
              <CardHeader><CardTitle className="text-base">Propriétaire</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <p className="font-medium">{annonce.proprietaire_nom}</p>
                {isConnected && currentUser.role === "locataire" && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={async () => {
                      try {
                        const token = localStorage.getItem("access_token");
                        const res   = await fetch(
                          "http://localhost:8000/api/messagerie/creer/",
                          {
                            method:  "POST",
                            headers: {
                              "Content-Type":  "application/json",
                              Authorization:   `Bearer ${token}`,
                            },
                            body: JSON.stringify({ annonce: Number(id) }),
                          }
                        );
                        if (res.ok) {
                          window.location.href = "/locataire/messages";
                        }
                      } catch {}
                    }}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Contacter le propriétaire
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Demande de visite */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Demander une visite</CardTitle>
              </CardHeader>
              <CardContent>

                {/* Non connecté */}
                {!isConnected && (
                  <div className="text-center py-4 space-y-3">
                    <Lock className="h-8 w-8 text-muted-foreground mx-auto opacity-50" />
                    <p className="text-sm text-muted-foreground">
                      Connectez-vous pour demander une visite
                    </p>
                    <Button className="w-full" asChild>
                      <Link href="/login">Se connecter</Link>
                    </Button>
                  </div>
                )}

                {/* Propriétaire — ne peut pas demander */}
                {isConnected && currentUser.role === "proprietaire" && (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">
                      Les propriétaires ne peuvent pas demander de visite.
                    </p>
                  </div>
                )}

                {/* Admin */}
                {isConnected && currentUser.role === "admin" && (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">
                      Vue administrateur — pas de demande de visite.
                    </p>
                  </div>
                )}

                {/* Locataire — peut demander */}
                {isConnected && isLocataire && (
                  <>
                    {visiteEnvoyee ? (
                      <div className="text-center py-6 space-y-3">
                        <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                        <p className="font-semibold text-green-600">Demande envoyée!</p>
                        <p className="text-sm text-muted-foreground">
                          Le propriétaire recevra une notification et vous contactera bientôt.
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          asChild
                        >
                          <Link href="/locataire/visites">Voir mes visites</Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">

                        {/* Créneaux ou date libre */}
                        {creneaux.length > 0 ? (
                          <div className="space-y-1.5">
                            <Label>Choisir un créneau disponible</Label>
                            <Select value={creneau} onValueChange={setCreneau}>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner..." />
                              </SelectTrigger>
                              <SelectContent>
                                {creneaux.map(c => (
                                  <SelectItem key={c.id} value={String(c.id)}>
                                    📅 {new Date(c.date_heure).toLocaleString("fr-TN")}
                                  </SelectItem>
                                ))}
                                <SelectItem value="libre">
                                  🗓️ Proposer une autre date
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground bg-secondary p-2 rounded-lg">
                            Aucun créneau prédéfini — proposez votre date
                          </p>
                        )}

                        {/* Date libre */}
                        {(creneaux.length === 0 || creneau === "libre") && (
                          <div className="space-y-1.5">
                            <Label>Date et heure souhaitées</Label>
                            <Input
                              type="datetime-local"
                              value={dateLibre}
                              onChange={e => setDateLibre(e.target.value)}
                              min={new Date().toISOString().slice(0, 16)}
                            />
                          </div>
                        )}

                        {/* Message */}
                        <div className="space-y-1.5">
                          <Label>Message (optionnel)</Label>
                          <Textarea
                            placeholder="Présentez-vous brièvement..."
                            rows={2}
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                          />
                        </div>

                        {visiteError && (
                          <p className="text-xs text-destructive bg-destructive/10 p-2 rounded-lg">
                            {visiteError}
                          </p>
                        )}

                        {/* Bouton confirmer */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              className="w-full"
                              disabled={
                                (!creneau && !dateLibre) ||
                                (creneau === "libre" && !dateLibre)
                              }
                            >
                              <CalendarCheck className="mr-2 h-4 w-4" />
                              Demander une visite
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Confirmer la demande de visite</DialogTitle>
                              <DialogDescription>
                                {creneau && creneau !== "libre"
                                  ? `Créneau: ${new Date(
                                      creneaux.find(c => String(c.id) === creneau)
                                        ?.date_heure || ""
                                    ).toLocaleString("fr-TN")}`
                                  : `Date proposée: ${dateLibre
                                      ? new Date(dateLibre).toLocaleString("fr-TN")
                                      : ""
                                    }`
                                }
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-3 pt-2">
                              <div className="bg-secondary/50 rounded-lg p-3 text-sm space-y-1">
                                <p><strong>Annonce:</strong> {annonce.titre}</p>
                                <p><strong>Propriétaire:</strong> {annonce.proprietaire_nom}</p>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Le propriétaire recevra votre demande et la confirmera ou annulera.
                              </p>
                              <Button
                                className="w-full"
                                onClick={handleDemanderVisite}
                                disabled={demanderVisite.isPending}
                              >
                                {demanderVisite.isPending
                                  ? "Envoi en cours..."
                                  : "✓ Confirmer la demande"
                                }
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Stats annonce */}
            <Card>
              <CardContent className="pt-4">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Publié le {new Date(annonce.created_at).toLocaleDateString("fr-TN")}</span>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}