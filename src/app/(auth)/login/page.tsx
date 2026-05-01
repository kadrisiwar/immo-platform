"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import api from "@/lib/api";

export default function LoginPage() {
  const router  = useRouter();
  const [form, setForm]     = useState({ username: "", password: "" });
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Étape 1 — Get JWT token
      const tokenRes = await api.post("/accounts/token/", {
        username: form.username,
        password: form.password,
      });

      const { access, refresh } = tokenRes.data;

      // Étape 2 — Save tokens
      localStorage.setItem("access_token",  access);
      localStorage.setItem("refresh_token", refresh);
      document.cookie = `access_token=${access}; path=/; max-age=3600`;

      // Étape 3 — Get user info + role
      const meRes = await api.get("/accounts/me/", {
        headers: { Authorization: `Bearer ${access}` },
      });

      const role = meRes.data.role;

      // Étape 4 — Redirect selon role
      if (role === "admin")        router.push("/admin");
      else if (role === "proprietaire") router.push("/proprietaire");
      else                         router.push("/locataire");

    } catch (err: any) {
      console.error("Login error:", err.response?.data);
      if (err.response?.status === 401) {
        setError("Nom d'utilisateur ou mot de passe incorrect.");
      } else if (err.response?.status === 400) {
        setError("Veuillez remplir tous les champs.");
      } else {
        setError("Erreur de connexion. Vérifiez que le serveur est lancé.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">🏠 ImmoPlat</CardTitle>
          <CardDescription>Connectez-vous à votre compte</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="space-y-2">
              <Label htmlFor="username">Nom d&apos;utilisateur</Label>
              <Input
                id="username"
                placeholder="username ou email@exemple.com"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                required
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
                autoComplete="current-password"
              />
            </div>

            <div className="flex justify-end">
              <Link href="/reset-password" className="text-xs text-muted-foreground hover:text-primary">
                Mot de passe oublié?
              </Link>
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Pas de compte ?{" "}
              <Link href="/register" className="text-primary hover:underline">
                S&apos;inscrire
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}