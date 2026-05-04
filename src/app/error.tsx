"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8">
        <AlertTriangle className="h-16 w-16 text-destructive mx-auto opacity-80" />
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Une erreur est survenue</h1>
          <p className="text-muted-foreground max-w-md">
            Quelque chose s&apos;est mal passé. Veuillez réessayer.
          </p>
          {error.message && (
            <p className="text-xs text-muted-foreground bg-secondary p-2 rounded">
              {error.message}
            </p>
          )}
        </div>
        <Button onClick={reset}>
          <RefreshCw className="mr-2 h-4 w-4" /> Réessayer
        </Button>
      </div>
    </div>
  );
}