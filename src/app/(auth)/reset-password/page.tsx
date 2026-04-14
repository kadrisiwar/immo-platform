"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";
import api from "@/lib/api";
import Link from "next/link";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Mode demande (pas de token dans URL)
  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/accounts/reset-password/", { email });
      setSuccess(true);
    } catch {
      setError("Erreur lors de l'envoi.");
    }
    setLoading(false);
  };

  // Mode confirmation (token dans URL)
  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await api.post("/accounts/reset-password/confirm/", {
        uid,
        token,
        password,
      });
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      setError("Lien invalide ou expiré.");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">🏠 ImmoPlat</CardTitle>
          <CardDescription>
            {uid && token
              ? "Nouveau mot de passe"
              : "Réinitialiser le mot de passe"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="text-center space-y-3 py-4">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
              <p className="font-medium text-green-600">
                {uid && token ? "Mot de passe modifié!" : "Email envoyé!"}
              </p>
              <p className="text-sm text-muted-foreground">
                {uid && token
                  ? "Vous allez être redirigé..."
                  : "Vérifiez votre boîte mail."}
              </p>
              {!uid && (
                <Button variant="outline" asChild className="mt-2">
                  <Link href="/login">Retour à la connexion</Link>
                </Button>
              )}
            </div>
          ) : uid && token ? (
            <form onSubmit={handleConfirm} className="space-y-4">
              <div className="space-y-2">
                <Label>Nouveau mot de passe</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Confirmer le mot de passe</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? "Modification..." : "Modifier le mot de passe"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRequest} className="space-y-4">
              <div className="space-y-2">
                <Label>Adresse email</Label>
                <Input
                  type="email"
                  placeholder="email@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? "Envoi..." : "Envoyer le lien"}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                <Link href="/login" className="text-primary hover:underline">
                  Retour à la connexion
                </Link>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
