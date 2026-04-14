"use client";

import { useState } from "react";
import { Eye, XCircle, CheckCircle, Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  phone: string;
  avatar: string | null;
  date_joined: string;
  is_active: boolean;
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("tous");
  const [selected, setSelected] = useState<User | null>(null);
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await api.get("/accounts/users/");
      return res.data as User[];
    },
  });

  const toggleActive = useMutation({
    mutationFn: async ({
      id,
      is_active,
    }: {
      id: number;
      is_active: boolean;
    }) => {
      const res = await api.patch(`/accounts/users/${id}/toggle/`, {
        is_active,
      });
      return res.data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
  });

  const filtered = users.filter((u) => {
    const matchSearch =
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "tous" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Chargement...</div>
      </div>
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Gestion des utilisateurs
        </h1>
        <p className="text-sm text-muted-foreground">
          {users.length} utilisateurs enregistrés
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {users.filter((u) => u.is_active).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Comptes actifs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {users.filter((u) => u.role === "proprietaire").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Propriétaires</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {users.filter((u) => u.role === "locataire").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Locataires</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Utilisateurs</CardTitle>
          <CardDescription>Gérez les comptes utilisateurs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous les rôles</SelectItem>
                <SelectItem value="proprietaire">Propriétaire</SelectItem>
                <SelectItem value="locataire">Locataire</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Inscrit le</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {u.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{u.username}</p>
                        <p className="text-xs text-muted-foreground">
                          {u.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {u.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={u.is_active ? "default" : "destructive"}>
                      {u.is_active ? "Actif" : "Suspendu"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(u.date_joined).toLocaleDateString("fr-TN")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelected(u)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Détails utilisateur</DialogTitle>
                            <DialogDescription>
                              Informations du compte
                            </DialogDescription>
                          </DialogHeader>
                          {selected && (
                            <div className="space-y-3 pt-2 text-sm">
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <span className="text-muted-foreground">
                                    Username:
                                  </span>
                                  <p>{selected.username}</p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">
                                    Email:
                                  </span>
                                  <p>{selected.email}</p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">
                                    Rôle:
                                  </span>
                                  <p className="capitalize">{selected.role}</p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">
                                    Téléphone:
                                  </span>
                                  <p>{selected.phone || "—"}</p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">
                                    Statut:
                                  </span>
                                  <p>
                                    <Badge
                                      variant={
                                        selected.is_active
                                          ? "default"
                                          : "destructive"
                                      }
                                    >
                                      {selected.is_active
                                        ? "Actif"
                                        : "Suspendu"}
                                    </Badge>
                                  </p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">
                                    Inscrit:
                                  </span>
                                  <p>
                                    {new Date(
                                      selected.date_joined
                                    ).toLocaleDateString("fr-TN")}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      {u.role !== "admin" &&
                        (u.is_active ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() =>
                              toggleActive.mutate({
                                id: u.id,
                                is_active: false,
                              })
                            }
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-green-600 hover:text-green-600"
                            onClick={() =>
                              toggleActive.mutate({ id: u.id, is_active: true })
                            }
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground py-8"
                  >
                    Aucun utilisateur trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
