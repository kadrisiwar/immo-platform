"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Sheet, SheetContent, SheetHeader,
  SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";

export interface SearchFilters {
  q:          string;
  ville:      string;
  type_bien:  string;
  loyer_min:  number;
  loyer_max:  number;
  surface_min:number;
  nb_pieces:  string;
  meuble:     string;
  equipements:string[];
}

const DEFAULT_FILTERS: SearchFilters = {
  q: "", ville: "", type_bien: "",
  loyer_min: 0, loyer_max: 5000,
  surface_min: 0, nb_pieces: "",
  meuble: "", equipements: [],
};

const EQUIPEMENTS = [
  "Climatisation", "Parking", "Ascenseur",
  "Balcon", "Piscine", "Wifi inclus",
  "Meublé", "Jardin", "Garage",
];

interface Props {
  onSearch: (filters: SearchFilters) => void;
}

export function AdvancedSearch({ onSearch }: Props) {
  const [filters, setFilters]   = useState<SearchFilters>(DEFAULT_FILTERS);
  const [open, setOpen]         = useState(false);

  const activeCount = [
    filters.ville, filters.type_bien, filters.meuble, filters.nb_pieces,
  ].filter(Boolean).length + filters.equipements.length +
  (filters.loyer_max < 5000 ? 1 : 0) + (filters.surface_min > 0 ? 1 : 0);

  const update = (k: keyof SearchFilters, v: any) =>
    setFilters(prev => ({ ...prev, [k]: v }));

  const toggleEq = (eq: string) => {
    setFilters(prev => ({
      ...prev,
      equipements: prev.equipements.includes(eq)
        ? prev.equipements.filter(e => e !== eq)
        : [...prev.equipements, eq],
    }));
  };

  const reset = () => setFilters(DEFAULT_FILTERS);

  const handleSearch = () => {
    onSearch(filters);
    setOpen(false);
  };

  return (
    <div className="flex gap-2">
      {/* Search bar */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher ville, titre..."
          className="pl-9"
          value={filters.q}
          onChange={e => update("q", e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSearch()}
        />
      </div>

      {/* Filtres avancés */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
  <Button variant="outline" className="relative">
    <SlidersHorizontal className="h-4 w-4 mr-2" />
    Filtres
    {activeCount > 0 && (
      <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
        {activeCount}
      </Badge>
    )}
  </Button>
</SheetTrigger>
        <SheetContent side="right" className="w-96 overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Recherche avancée</SheetTitle>
          </SheetHeader>

          <div className="space-y-6 mt-6">

            {/* Ville */}
            <div className="space-y-2">
              <Label>Ville</Label>
              <Select value={filters.ville || "toutes"} onValueChange={v => update("ville", v === "toutes" ? "" : v)}>
                <SelectTrigger>
  <SelectValue placeholder="Choisir..." />
</SelectTrigger>
                <SelectContent>
                  <SelectItem value="toutes">Toutes les villes</SelectItem>
                  {["Tunis","Ariana","La Marsa","Carthage","Sfax","Sousse","Gammarth"].map(v => (
                    <SelectItem key={v} value={v}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Type */}
            <div className="space-y-2">
              <Label>Type de bien</Label>
              <Select value={filters.type_bien || "tous"} onValueChange={v => update("type_bien", v === "tous" ? "" : v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous les types</SelectItem>
                  {["appartement","studio","villa","duplex"].map(t => (
                    <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Loyer */}
            <div className="space-y-3">
              <Label>
                Loyer: <span className="text-primary font-bold">
                  {filters.loyer_min} — {filters.loyer_max} DT
                </span>
              </Label>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Minimum</p>
                <Slider
                  min={0} max={5000} step={50}
                  value={[filters.loyer_min || 0]}
                  onValueChange={([v]) => update("loyer_min", v)}
                />
                <p className="text-xs text-muted-foreground">Maximum</p>
                <Slider
                  min={0} max={5000} step={50}
                  value={[filters.loyer_max]}
                  onValueChange={([v]) => update("loyer_max", v)}
                />
              </div>
            </div>

            {/* Surface */}
            <div className="space-y-2">
              <Label>Surface minimum: <span className="text-primary font-bold">{filters.surface_min}m²</span></Label>
              <Slider
                min={0} max={500} step={10}
                value={[filters.surface_min]}
                onValueChange={([v]) => update("surface_min", v)}
              />
            </div>

            {/* Pièces */}
            <div className="space-y-2">
              <Label>Nombre de pièces</Label>
              <div className="flex gap-2 flex-wrap">
                {["", "1", "2", "3", "4", "5+"].map(p => (
                  <Button
                    key={p}
                    variant={filters.nb_pieces === p ? "default" : "outline"}
                    size="sm"
                    onClick={() => update("nb_pieces", p)}
                  >
                    {p === "" ? "Tous" : p}
                  </Button>
                ))}
              </div>
            </div>

            {/* Meublé */}
            <div className="space-y-2">
              <Label>Meublé</Label>
              <div className="flex gap-2">
                {[["", "Tous"], ["oui", "Meublé"], ["non", "Non meublé"]].map(([v, l]) => (
                  <Button
                    key={v}
                    variant={filters.meuble === v ? "default" : "outline"}
                    size="sm"
                    onClick={() => update("meuble", v)}
                  >
                    {l}
                  </Button>
                ))}
              </div>
            </div>

            {/* Équipements */}
            <div className="space-y-2">
              <Label>Équipements</Label>
              <div className="flex flex-wrap gap-2">
                {EQUIPEMENTS.map(eq => (
                  <Badge
                    key={eq}
                    variant={filters.equipements.includes(eq) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleEq(eq)}
                  >
                    {filters.equipements.includes(eq) && "✓ "}{eq}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <Button variant="outline" className="flex-1" onClick={reset}>
                <X className="h-4 w-4 mr-1" /> Réinitialiser
              </Button>
              <Button className="flex-1" onClick={handleSearch}>
                <Search className="h-4 w-4 mr-1" /> Rechercher
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Button onClick={handleSearch}>
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
}