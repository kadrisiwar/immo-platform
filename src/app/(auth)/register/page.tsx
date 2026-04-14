"use client";

import { useState } from "react";
import { useRegister } from "@/hooks/use-auth";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "" as "proprietaire" | "locataire",
    phone: "",
  });
  const [error, setError] = useState("");
  const register = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (!form.role) {
      setError("Veuillez choisir un rôle.");
      return;
    }

    register.mutate({
      username: form.username,
      email: form.email,
      password: form.password,
      role: form.role,
      phone: form.phone,
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">🏠 ImmoPlat</CardTitle>
          <CardDescription>Créez votre compte</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
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

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@exemple.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                placeholder="+216 XX XXX XXX"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label>Je suis</Label>
              <Select
                value={form.role}
                onValueChange={(val) =>
                  setForm({
                    ...form,
                    role: val as "proprietaire" | "locataire",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="proprietaire">🏠 Propriétaire</SelectItem>
                  <SelectItem value="locataire">🔑 Locataire</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Password */}
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

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                required
              />
            </div>

            {/* Errors */}
            {error && <p className="text-sm text-destructive">{error}</p>}
            {register.isError && (
              <p className="text-sm text-destructive">
                Erreur lors de l&apos;inscription. Veuillez réessayer.
              </p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={register.isPending}
            >
              {register.isPending ? "Inscription..." : "S'inscrire"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Déjà un compte ?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Se connecter
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
