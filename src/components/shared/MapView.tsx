"use client";

import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from "@vis.gl/react-google-maps";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Annonce {
  id:        number;
  titre:     string;
  ville:     string;
  loyer:     string;
  type_bien: string;
  nb_pieces: number;
  surface:   number;
  latitude:  number | null;
  longitude: number | null;
}

interface MapViewProps {
  annonces: Annonce[];
  height?: string;
}

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

export function MapView({ annonces, height = "500px" }: MapViewProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const validAnnonces = annonces.filter(a => a.latitude && a.longitude);
  const selected      = validAnnonces.find(a => a.id === selectedId);

  // Centre de la carte — Tunisie
  const center = validAnnonces.length > 0
    ? { lat: validAnnonces[0].latitude!, lng: validAnnonces[0].longitude! }
    : { lat: 36.8065, lng: 10.1815 };

  if (!API_KEY) {
    return (
      <div
        className="flex items-center justify-center bg-secondary rounded-xl border"
        style={{ height }}
      >
        <div className="text-center text-muted-foreground p-8">
          <p className="font-medium">Carte non configurée</p>
          <p className="text-sm mt-1">Ajoutez NEXT_PUBLIC_GOOGLE_MAPS_API_KEY dans .env.local</p>
        </div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={API_KEY}>
      <div style={{ height }} className="rounded-xl overflow-hidden border">
        <Map
          defaultCenter={center}
          defaultZoom={11}
          mapId="immo-platform-map"
          gestureHandling="greedy"
          disableDefaultUI={false}
        >
          {validAnnonces.map((annonce) => (
            <AdvancedMarker
              key={annonce.id}
              position={{ lat: annonce.latitude!, lng: annonce.longitude! }}
              onClick={() => setSelectedId(annonce.id === selectedId ? null : annonce.id)}
            >
              {/* Pin personnalisé avec le prix */}
              <div
                className="relative cursor-pointer group"
                style={{ transform: "translateY(-50%)" }}
              >
                <div className={`
                  px-2.5 py-1.5 rounded-full text-xs font-bold shadow-lg
                  border-2 transition-all duration-200
                  ${selectedId === annonce.id
                    ? "bg-primary text-primary-foreground border-primary scale-110"
                    : "bg-white text-foreground border-white hover:scale-105 hover:bg-primary hover:text-primary-foreground"
                  }
                `}>
                  {annonce.loyer} DT
                </div>
                <div className={`
                  absolute left-1/2 -bottom-1.5 -translate-x-1/2
                  w-0 h-0 border-l-4 border-r-4 border-t-4
                  border-l-transparent border-r-transparent
                  ${selectedId === annonce.id ? "border-t-primary" : "border-t-white"}
                `} />
              </div>
            </AdvancedMarker>
          ))}

          {/* InfoWindow */}
          {selected && selected.latitude && selected.longitude && (
            <InfoWindow
              position={{ lat: selected.latitude, lng: selected.longitude }}
              onCloseClick={() => setSelectedId(null)}
              pixelOffset={[0, -45]}
            >
              <div className="p-1 min-w-48">
                <p className="font-semibold text-sm">{selected.titre}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs capitalize">
                    {selected.type_bien}
                  </Badge>
                  <span className="text-primary font-bold text-sm">{selected.loyer} DT</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  📍 {selected.ville} · {selected.nb_pieces} pièces · {selected.surface}m²
                </p>
                <Link href={`/annonces/${selected.id}`}>
                  <button
                    className="mt-2 w-full bg-primary text-white text-xs py-1.5 px-3 rounded-md hover:opacity-90 transition-opacity"
                  >
                    Voir l'annonce →
                  </button>
                </Link>
              </div>
            </InfoWindow>
          )}
        </Map>
      </div>

      {validAnnonces.length === 0 && (
        <p className="text-center text-sm text-muted-foreground mt-2">
          Aucune annonce avec coordonnées disponible
        </p>
      )}
    </APIProvider>
  );
}