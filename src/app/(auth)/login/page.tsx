"use client";

import { useState } from "react";
import { useLogin } from "@/hooks/use-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const login = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate(form);
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
                placeholder="username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <div className="flex justify-end">
              <Link
                href="/reset-password"
                className="text-xs text-muted-foreground hover:text-primary"
              >
                Mot de passe oublié?
              </Link>
            </div>

            {/* Error message */}
            {login.isError && (
              <p className="text-sm text-destructive">
                Identifiants incorrects. Veuillez réessayer.
              </p>
            )}

            <Button type="submit" className="w-full" disabled={login.isPending}>
              {login.isPending ? "Connexion..." : "Se connecter"}
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
