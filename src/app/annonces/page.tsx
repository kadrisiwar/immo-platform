"use client";

import { useEffect, useState } from "react";
import { useAnnonces } from "@/hooks/use-annonces";
import { Search, MapPin, Home, Heart, Eye, BedDouble, Maximize2, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/empty-state";
import Link from "next/link";
import { MapView } from "@/components/shared/MapView";
import { Map, List } from "lucide-react";
import { useSearchParams } from "next/navigation";

const PER_PAGE = 9;

export default function AnnoncesPage() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [ville, setVille] = useState("");
  const [typeBien, setTypeBien] = useState("");
  const [prixMax, setPrixMax] = useState([3000]);
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState<number[]>(() => {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem("favoris") || "[]");
  });
  const [viewMode, setViewMode] = useState<"liste" | "carte">("liste");
  useEffect(() => {
  const q = searchParams.get("q");
  if (q) setSearch(q);
}, [searchParams]);
  const { data: annonces = [], isLoading, isError } = useAnnonces({
    ville: ville || undefined,
    type_bien: typeBien || undefined,
    loyer_max: prixMax[0] < 3000 ? prixMax[0] : undefined,
  });

  const filtered = annonces.filter((a) =>
    a.titre.toLowerCase().includes(search.toLowerCase()) ||
    a.ville.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const toggleFavorite = (id: number) => {
    const saved = JSON.parse(localStorage.getItem("favoris") || "[]");
    const newFavoris = saved.includes(id)
      ? saved.filter((f: number) => f !== id)
      : [...saved, id];
    localStorage.setItem("favoris", JSON.stringify(newFavoris));
    setFavorites(newFavoris);
  };

  const resetFiltres = () => {
    setSearch("");
    setVille("");
    setTypeBien("");
    setPrixMax([3000]);
    setPage(1);
  };
  

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">🏠 ImmoPlat</Link>
          <div className="flex gap-2">
            <Button variant="outline" asChild><Link href="/login">Se connecter</Link></Button>
            <Button asChild><Link href="/register">S&apos;inscrire</Link></Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-primary/5 border-b py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Trouvez votre logement idéal</h1>
          <p className="text-muted-foreground mb-6">
            {isLoading ? "Chargement..." : `${filtered.length} annonces disponibles`}
          </p>
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Rechercher par ville, titre..."
              className="pl-10 h-12 text-base"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* Filtres mobile */}
        <div className="lg:hidden flex gap-2 mb-4">
          <Select
            value={ville || "toutes"}
            onValueChange={(v) => { setVille(v === "toutes" ? "" : v); setPage(1); }}
            disabled={isLoading}
          >
            <SelectTrigger className="flex-1"><SelectValue placeholder="Ville" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="toutes">Toutes les villes</SelectItem>
              <SelectItem value="Tunis">Tunis</SelectItem>
              <SelectItem value="Ariana">Ariana</SelectItem>
              <SelectItem value="La Marsa">La Marsa</SelectItem>
              <SelectItem value="Sfax">Sfax</SelectItem>
              <SelectItem value="Sousse">Sousse</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={typeBien || "tous"}
            onValueChange={(v) => { setTypeBien(v === "tous" ? "" : v); setPage(1); }}
            disabled={isLoading}
          >
            <SelectTrigger className="flex-1"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Tous les types</SelectItem>
              <SelectItem value="appartement">Appartement</SelectItem>
              <SelectItem value="studio">Studio</SelectItem>
              <SelectItem value="villa">Villa</SelectItem>
              <SelectItem value="duplex">Duplex</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={resetFiltres} disabled={isLoading}>✕</Button>
        </div>

        <div className="flex gap-6">
          {/* Sidebar filtres desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 space-y-5">
              <div className="flex items-center gap-2 font-medium">
                <Filter className="h-4 w-4" /> Filtres
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Ville</label>
                <Select
                  value={ville || "toutes"}
                  onValueChange={(v) => { setVille(v === "toutes" ? "" : v); setPage(1); }}
                  disabled={isLoading}
                >
                  <SelectTrigger><SelectValue placeholder="Toutes les villes" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="toutes">Toutes les villes</SelectItem>
                    <SelectItem value="Tunis">Tunis</SelectItem>
                    <SelectItem value="Ariana">Ariana</SelectItem>
                    <SelectItem value="La Marsa">La Marsa</SelectItem>
                    <SelectItem value="Carthage">Carthage</SelectItem>
                    <SelectItem value="Gammarth">Gammarth</SelectItem>
                    <SelectItem value="Sfax">Sfax</SelectItem>
                    <SelectItem value="Sousse">Sousse</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Type de bien</label>
                <Select
                  value={typeBien || "tous"}
                  onValueChange={(v) => { setTypeBien(v === "tous" ? "" : v); setPage(1); }}
                  disabled={isLoading}
                >
                  <SelectTrigger><SelectValue placeholder="Tous les types" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tous">Tous les types</SelectItem>
                    <SelectItem value="appartement">Appartement</SelectItem>
                    <SelectItem value="studio">Studio</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="duplex">Duplex</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">
                  Prix max: <span className="text-primary font-bold">{prixMax[0]} DT</span>
                </label>
                <Slider
                  min={200} max={3000} step={50}
                  value={prixMax}
                  onValueChange={(v) => { setPrixMax(v); setPage(1); }}
                  disabled={isLoading}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>200 DT</span><span>3000 DT</span>
                </div>
              </div>

              <Button variant="outline" className="w-full" onClick={resetFiltres} disabled={isLoading}>
                Réinitialiser
              </Button>
            </div>
          </aside>

          {/* Résultats */}
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-4">
              <span className="font-medium text-foreground">{filtered.length}</span> annonces trouvées
              {filtered.length > PER_PAGE && (
                <span> — page {page}/{Math.ceil(filtered.length / PER_PAGE)}</span>
              )}
            </p>
            
            {/* Toggle vue */}
<div className="flex items-center justify-between mb-4">
  <p className="text-sm text-muted-foreground">
    <span className="font-medium text-foreground">{filtered.length}</span> annonces trouvées
  </p>
  <div className="flex items-center border rounded-lg overflow-hidden">
    <Button
      variant={viewMode === "liste" ? "default" : "ghost"}
      size="sm"
      className="rounded-none"
      onClick={() => setViewMode("liste")}
    >
      <List className="h-4 w-4 mr-1" /> Liste
    </Button>
    <Button
      variant={viewMode === "carte" ? "default" : "ghost"}
      size="sm"
      className="rounded-none"
      onClick={() => setViewMode("carte")}
    >
      <Map className="h-4 w-4 mr-1" /> Carte
    </Button>
  </div>
</div>

{/* Vue carte */}
{viewMode === "carte" && (
  <MapView annonces={filtered} height="600px" />
)}

{/* Vue liste — mochkla kif tchouf filtered.map — conditionnel */}
{viewMode === "liste" && (
  <>
    {/* ... el grid mte3 el annonces كما هو ... */}
  </>
)}

            {isLoading && (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="h-48 bg-secondary animate-pulse" />
                    <CardContent className="p-4 space-y-3">
                      <div className="h-4 bg-secondary rounded animate-pulse" />
                      <div className="h-3 bg-secondary rounded w-2/3 animate-pulse" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {isError && (
              <EmptyState
                icon={Home}
                title="Erreur lors du chargement"
                description="Une erreur s'est produite lors du chargement des annonces. Veuillez réessayer."
                action={{ label: "Réessayer", href: "/annonces" }}
              />
            )}

            {!isLoading && !isError && filtered.length === 0 && (
              <EmptyState
                icon={Home}
                title="Aucune annonce trouvée"
                description="Modifiez vos critères de recherche pour trouver des annonces"
                action={{ label: "Réinitialiser les filtres", href: "#" }}
              />
            )}

            {!isLoading && !isError && paginated.length > 0 && (
              <>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {paginated.map((a) => (
                    <Card key={a.id} className="overflow-hidden hover:shadow-md transition-shadow group">
                      {/* Image avec fallback */}
<div className="h-48 relative overflow-hidden">
  {a.images && a.images.length > 0 ? (
    <img
      src={`http://localhost:8000${a.images[0].image}`}
      alt={a.titre}
      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = "none";
        (e.target as HTMLImageElement).nextElementSibling?.removeAttribute("hidden");
      }}
    />
  ) : null}
  {/* Fallback gradient */}
  <div className={`w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center ${a.images && a.images.length > 0 ? "hidden" : ""}`}>
    <Home className="h-16 w-16 text-primary/20" />
  </div>

  <Badge className="absolute top-2 left-2 bg-white text-foreground border text-xs shadow-sm">
    {a.type_bien}
  </Badge>
  {a.images && a.images.length > 1 && (
    <Badge className="absolute bottom-2 right-2 bg-black/50 text-white border-0 text-xs">
      📷 {a.images.length}
    </Badge>
  )}
  <Button
    variant="ghost" size="icon"
    className="absolute top-2 right-2 bg-white/80 hover:bg-white"
    onClick={(e) => { e.preventDefault(); toggleFavorite(a.id); }}
  >
    <Heart className={`h-4 w-4 ${favorites.includes(a.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
  </Button>
</div>

                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-medium text-sm leading-tight line-clamp-2">{a.titre}</h3>
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

                        <div className="flex items-center justify-between pt-1 border-t">
                          <span className="text-xs text-muted-foreground truncate">
                            Par {a.proprietaire_nom}
                          </span>
                          <Button size="sm" asChild disabled={isLoading}>
                            <Link href={`/annonces/${a.id}`}>Voir détails</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Pagination
                  page={page}
                  total={filtered.length}
                  perPage={PER_PAGE}
                  onChange={(p) => {
                    setPage(p);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}