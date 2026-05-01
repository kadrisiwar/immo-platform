"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CheckCircle, Globe, Smartphone, Monitor } from "lucide-react";

export default function ConfigPage() {
  const [apiUrl, setApiUrl]     = useState("");
  const [frontUrl, setFrontUrl] = useState("");
  const [saved, setSaved]       = useState(false);
  const [current, setCurrent]   = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("IMMO_API_URL") || "http://localhost:8000/api";
    setApiUrl(saved);
    setCurrent(saved);
    setFrontUrl(window.location.origin);
  }, []);

  const handleSave = () => {
    const cleanUrl = apiUrl.trim().replace(/\/$/, "");
    localStorage.setItem("IMMO_API_URL", cleanUrl);
    setSaved(true);
    setCurrent(cleanUrl);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    const defaultUrl = "http://localhost:8000/api";
    localStorage.setItem("IMMO_API_URL", defaultUrl);
    setApiUrl(defaultUrl);
    setCurrent(defaultUrl);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const isNgrok = current.includes("ngrok");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-4">

        <div className="text-center">
          <h1 className="text-2xl font-bold">🏠 ImmoPlat Config</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Configuration de la connexion API
          </p>
        </div>

        {/* Status actuel */}
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              {isNgrok ? (
                <Smartphone className="h-5 w-5 text-green-500" />
              ) : (
                <Monitor className="h-5 w-5 text-blue-500" />
              )}
              <div>
                <p className="text-sm font-medium">
                  Mode: {isNgrok ? "📱 Mobile (ngrok)" : "💻 Local (localhost)"}
                </p>
                <p className="text-xs text-muted-foreground truncate max-w-xs">
                  {current}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Config */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              URL API Backend
            </CardTitle>
            <CardDescription>
              Pour accéder depuis mobile, utilisez l'URL ngrok
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>URL de l'API</Label>
              <Input
                value={apiUrl}
                onChange={e => setApiUrl(e.target.value)}
                placeholder="https://xxxx-xx-xx-xx-xx.ngrok-free.app/api"
                className="font-mono text-sm"
              />
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 rounded-lg p-4 text-sm space-y-2">
              <p className="font-semibold text-blue-800">📱 Comment utiliser sur mobile:</p>
              <ol className="space-y-1 text-blue-700 list-decimal list-inside">
                <li>Lance <code className="bg-blue-100 px-1 rounded">start-all.bat</code></li>
                <li>Dans terminal ngrok, copy l'URL backend</li>
                <li>
                  Ex: <code className="bg-blue-100 px-1 rounded text-xs">
                    https://abc123.ngrok-free.app
                  </code>
                </li>
                <li>
                  Colle ici + ajoute <code className="bg-blue-100 px-1 rounded">/api</code>
                </li>
                <li>Sauvegarde → ouvre le site sur mobile</li>
              </ol>
            </div>

            {saved && (
              <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 p-3 rounded-lg">
                <CheckCircle className="h-4 w-4" />
                Configuration sauvegardée!
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleReset}
              >
                🖥️ Local
              </Button>
              <Button
                className="flex-1"
                onClick={handleSave}
                disabled={!apiUrl.trim()}
              >
                💾 Sauvegarder
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lien retour */}
        <div className="text-center">
          <a href="/" className="text-sm text-primary hover:underline">
            ← Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
}