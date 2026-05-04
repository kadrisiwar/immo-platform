"use client";

import { useState, useEffect } from "react";
import { Heart, Home, MapPin, BedDouble, Maximize2, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import api from "@/lib/api";

export default function LocataireFavorisPage() {
  const [favorisIds, setFavorisIds] = useState<number[]>([]);
  const [annonces, setAnnonces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // جلب المفضلات من localStorage
    const saved = localStorage.getItem("favoris");
    console.log("Favoris sauvegardés:", saved);
    
    if (saved && saved !== "[]") {
      const ids = JSON.parse(saved);
      setFavorisIds(ids);
      
      // جلب تفاصيل الإعلانات المفضلة
      if (ids.length > 0) {
        api.get("/annonces/")
          .then(res => {
            const filtered = res.data.filter((a: any) => ids.includes(a.id));
            console.log("Annonces filtrées:", filtered);
            setAnnonces(filtered);
          })
          .catch(err => console.error("Erreur chargement annonces:", err))
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const removeFavori = (id: number) => {
    const newIds = favorisIds.filter(f => f !== id);
    setFavorisIds(newIds);
    localStorage.setItem("favoris", JSON.stringify(newIds));
    setAnnonces(annonces.filter(a => a.id !== id));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Mes favoris</h1>
            <p className="text-sm text-muted-foreground">Chargement...</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/annonces">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux annonces
            </Link>
          </Button>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec bouton retour */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Mes favoris</h1>
          <p className="text-sm text-muted-foreground">
            {favorisIds.length} annonce{favorisIds.length !== 1 ? 's' : ''} sauvegardée{favorisIds.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/annonces">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux annonces
          </Link>
        </Button>
      </div>

      {favorisIds.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            <Heart className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="font-medium">Aucun favori pour le moment</p>
            <p className="text-sm mt-1">Ajoutez des annonces depuis la page de recherche</p>
            <Button variant="outline" size="sm" className="mt-4" asChild>
              <Link href="/annonces">Voir les annonces</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {annonces.map((a) => (
            <Card key={a.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-40 relative bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                {a.images && a.images.length > 0 ? (
                  <img
                    src={`http://localhost:8000${a.images[0].image}`}
                    alt={a.titre}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Home className="h-12 w-12 text-primary/20" />
                )}
                <Badge className="absolute top-2 left-2 bg-white text-foreground border text-xs">
                  {a.type_bien}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                  onClick={() => removeFavori(a.id)}
                >
                  <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                </Button>
              </div>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium text-sm line-clamp-2">{a.titre}</h3>
                  <span className="text-primary font-bold text-sm shrink-0">{a.loyer} DT</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />{a.ville}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <BedDouble className="h-3 w-3" />{a.nb_pieces} pièces
                  </span>
                  <span className="flex items-center gap-1">
                    <Maximize2 className="h-3 w-3" />{a.surface}m²
                  </span>
                </div>
                <Button size="sm" className="w-full" asChild>
                  <Link href={`/annonces/${a.id}`}>Voir détails</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}