"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center flex-col gap-6 text-center px-4">
      <AlertTriangle className="h-16 w-16 text-destructive opacity-50" />
      <div>
        <h1 className="text-2xl font-bold mb-2">Une erreur est survenue</h1>
        <p className="text-muted-foreground">Veuillez réessayer ou contacter le support.</p>
      </div>
      <Button onClick={reset}>Réessayer</Button>
    </div>
  );
}