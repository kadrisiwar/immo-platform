"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CheckCircle, Globe } from "lucide-react";

export default function SettingsPage() {
  const [apiUrl, setApiUrl]   = useState("");
  const [saved, setSaved]     = useState(false);

  useEffect(() => {
    const url = localStorage.getItem("api_base_url") || "http://localhost:8000/api";
    setApiUrl(url);
  }, []);

  const handleSave = () => {
    localStorage.setItem("api_base_url", apiUrl);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      window.location.reload();
    }, 1500);
  };

  const handleReset = () => {
    localStorage.removeItem("api_base_url");
    setApiUrl("http://localhost:8000/api");
    window.location.reload();
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-semibold">Paramètres</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" /> Configuration API
          </CardTitle>
          <CardDescription>
            Changez l'URL de l'API backend (utile pour ngrok ou production)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>URL de l'API Backend</Label>
            <Input
              value={apiUrl}
              onChange={e => setApiUrl(e.target.value)}
              placeholder="https://xxxx-xx-xx-xx-xx.ngrok-free.app/api"
            />
            <p className="text-xs text-muted-foreground">
              Pour ngrok: copiez l'URL du terminal ngrok Backend (port 8000)
            </p>
          </div>

          <div className="p-3 bg-secondary rounded-lg text-xs space-y-1">
            <p className="font-medium">Comment utiliser ngrok:</p>
            <p>1. Lancez start-dev.bat</p>
            <p>2. Dans le terminal "ngrok Backend", copiez l'URL https://xxxx.ngrok-free.app</p>
            <p>3. Collez-la ici + ajoutez <code>/api</code> à la fin</p>
            <p>4. Sauvegardez — le site fonctionnera sur mobile!</p>
          </div>

          {saved && (
            <div className="flex items-center gap-2 text-green-600 text-sm">
              <CheckCircle className="h-4 w-4" />
              URL sauvegardée! Rechargement...
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset}>
              Réinitialiser (localhost)
            </Button>
            <Button onClick={handleSave}>
              Sauvegarder
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}