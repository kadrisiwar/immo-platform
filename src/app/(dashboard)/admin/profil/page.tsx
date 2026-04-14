"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import api from "@/lib/api";

export default function AdminProfilPage() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await api.get("/accounts/me/");
      return res.data;
    },
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Chargement...</div>
      </div>
    );

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-semibold">Mon profil</h1>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                {user?.username?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{user?.username}</CardTitle>
              <Badge className="mt-1 capitalize">{user?.role}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium">{user?.email || "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Téléphone</p>
              <p className="font-medium">{user?.phone || "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Rôle</p>
              <p className="font-medium capitalize">{user?.role}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Membre depuis</p>
              <p className="font-medium">
                {user?.date_joined
                  ? new Date(user.date_joined).toLocaleDateString("fr-TN")
                  : "—"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
