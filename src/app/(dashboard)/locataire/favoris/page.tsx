"use client";

import { Heart, Home, MapPin, BedDouble, Maximize2, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useFavoris, useToggleFavori } from "@/hooks/use-favoris";
import api from "@/lib/api";
import Link from "next/link";

export default function LocataireFavorisPage() {
  const { data: favorisIds = [], isLoading: loadingIds } = useFavoris();
  const toggleFavori = useToggleFavori();

  const { data: annonces = [], isLoading: loadingAnnonces } = useQuery({
    queryKey: ["annonces-favoris-data", favorisIds],
    queryFn: async () => {
      if (favorisIds.length === 0) return [];
      const res = await api.get("/annonces/");
      return res.data.filter((a: any) => favorisIds.includes(a.id));
    },
    enabled: !loadingIds,
  });

  const isLoading = loadingIds || loadingAnnonces;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Mes favoris</h1>
        <p className="text-sm text-muted-foreground">{favorisIds.length} annonces sauvegardées</p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="h-40 bg-secondary animate-pulse" />
              <CardContent className="p-4 space-y-2">
                <div className="h-4 bg-secondary rounded animate-pulse" />
                <div className="h-3 bg-secondary rounded w-2/3 animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : favorisIds.length === 0 ? (
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
          {annonces.map((a: any) => (
            <Card key={a.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-40 relative">
                {a.images && a.images.length > 0 ? (
                  <img
                    src={`http://localhost:8000${a.images[0].image}`}
                    alt={a.titre}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <Home className="h-12 w-12 text-primary/20" />
                  </div>
                )}
                <Badge className="absolute top-2 left-2 bg-white text-foreground border text-xs">
                  {a.type_bien}
                </Badge>
                <Button
                  variant="ghost" size="icon"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                  onClick={() => toggleFavori.mutate(a.id)}
                  disabled={toggleFavori.isPending}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
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