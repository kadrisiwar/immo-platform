"use client";

import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle, Upload } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

export default function LocataireProfilPage() {
  const qc = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { data: user, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const r = await api.get("/accounts/me/");
      return r.data;
    },
  });

  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState<any>({});
  const [uploading, setUploading] = useState(false);

  const openEdit = () => {
    setForm({
      username: user?.username,
      email: user?.email,
      phone: user?.phone || "",
      password: "",
    });
    setEditing(true);
    setSuccess(false);
  };

  const update = useMutation({
    mutationFn: async (data: any) => {
      const payload: any = {};
      if (data.username !== user?.username) payload.username = data.username;
      if (data.email !== user?.email) payload.email = data.email;
      if (data.phone !== user?.phone) payload.phone = data.phone;
      if (data.password) payload.password = data.password;
      
      const r = await api.patch("/accounts/profil/update/", payload);
      return r.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["me"] });
      setEditing(false);
      setSuccess(true);
      toast.success("Profil mis à jour");
    },
  });

  const uploadAvatar = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      await api.patch("/accounts/profil/update/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      qc.invalidateQueries({ queryKey: ["me"] });
      toast.success("Photo de profil mise à jour");
    } catch {
      toast.error("Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadAvatar(file);
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-muted-foreground">Chargement...</div>
    </div>
  );

  const avatarUrl = user?.avatar ? `http://localhost:8000${user.avatar}` : null;

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-semibold">Mon profil</h1>

      {success && (
        <div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 p-3 text-green-700 text-sm">
          <CheckCircle className="h-4 w-4" />
          Profil mis à jour avec succès!
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Avatar avec upload */}
              <div className="relative group">
                <Avatar className="h-20 w-20">
                  {avatarUrl && <AvatarImage src={avatarUrl} />}
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {user?.username?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={uploading}
                >
                  <Upload className="h-6 w-6 text-white" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
              </div>
              <div>
                <CardTitle>{user?.username}</CardTitle>
                <Badge className="mt-1 capitalize">{user?.role}</Badge>
              </div>
            </div>
            {!editing && (
              <Button variant="outline" onClick={openEdit}>
                Modifier
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!editing ? (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Username</p>
                <p className="font-medium">{user?.username}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="font-medium">{user?.email || "—"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Téléphone</p>
                <p className="font-medium">{user?.phone || "—"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Membre depuis</p>
                <p className="font-medium">
                  {user?.date_joined ? new Date(user.date_joined).toLocaleDateString("fr-TN") : "—"}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Username</Label>
                  <Input
                    value={form.username || ""}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={form.email || ""}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Téléphone</Label>
                <Input
                  value={form.phone || ""}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>
                  Nouveau mot de passe{" "}
                  <span className="text-muted-foreground text-xs">
                    (laisser vide pour ne pas changer)
                  </span>
                </Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={form.password || ""}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setEditing(false)}>
                  Annuler
                </Button>
                <Button className="flex-1" onClick={() => update.mutate(form)} disabled={update.isPending}>
                  {update.isPending ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}