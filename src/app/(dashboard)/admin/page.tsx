"use client";

import {
  Users,
  Home,
  CalendarCheck,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const STATS = [
  {
    title: "Utilisateurs",
    value: "1 248",
    change: "+12%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Annonces actives",
    value: "342",
    change: "+8%",
    trend: "up",
    icon: Home,
  },
  {
    title: "Visites planifiées",
    value: "89",
    change: "-3%",
    trend: "down",
    icon: CalendarCheck,
  },
  {
    title: "Litiges ouverts",
    value: "7",
    change: "+2",
    trend: "down",
    icon: AlertTriangle,
  },
];

type UserStatus = "actif" | "suspendu" | "en_attente";
type AnnonceStatus = "active" | "en_moderation" | "rejetee";

const USERS = [
  {
    id: 1,
    name: "Sami Ben Ali",
    email: "sami@mail.com",
    role: "proprietaire",
    status: "actif" as UserStatus,
    date: "01/04/2026",
  },
  {
    id: 2,
    name: "Lina Trabelsi",
    email: "lina@mail.com",
    role: "locataire",
    status: "actif" as UserStatus,
    date: "31/03/2026",
  },
  {
    id: 3,
    name: "Karim Mansour",
    email: "karim@mail.com",
    role: "proprietaire",
    status: "suspendu" as UserStatus,
    date: "30/03/2026",
  },
  {
    id: 4,
    name: "Nour Belhaj",
    email: "nour@mail.com",
    role: "locataire",
    status: "en_attente" as UserStatus,
    date: "29/03/2026",
  },
  {
    id: 5,
    name: "Youssef Chaabane",
    email: "youssef@mail.com",
    role: "proprietaire",
    status: "actif" as UserStatus,
    date: "28/03/2026",
  },
];

const ANNONCES = [
  {
    id: 1,
    titre: "Appart 3 pièces - Lac 2",
    proprietaire: "Sami Ben Ali",
    loyer: "900 DT",
    status: "active" as AnnonceStatus,
    date: "01/04/2026",
  },
  {
    id: 2,
    titre: "Studio meublé - Manar",
    proprietaire: "Karim Mansour",
    loyer: "450 DT",
    status: "en_moderation" as AnnonceStatus,
    date: "31/03/2026",
  },
  {
    id: 3,
    titre: "Villa - La Marsa",
    proprietaire: "Youssef Chaabane",
    loyer: "2500 DT",
    status: "active" as AnnonceStatus,
    date: "30/03/2026",
  },
  {
    id: 4,
    titre: "Duplex - El Menzah 6",
    proprietaire: "Sami Ben Ali",
    loyer: "1200 DT",
    status: "rejetee" as AnnonceStatus,
    date: "29/03/2026",
  },
];

function UserStatusBadge({ status }: { status: UserStatus }) {
  const map = {
    actif: { label: "Actif", variant: "default" as const },
    suspendu: { label: "Suspendu", variant: "destructive" as const },
    en_attente: { label: "En attente", variant: "secondary" as const },
  };
  return <Badge variant={map[status].variant}>{map[status].label}</Badge>;
}

function AnnonceStatusBadge({ status }: { status: AnnonceStatus }) {
  const map = {
    active: {
      label: "Active",
      cls: "bg-green-100 text-green-800 hover:bg-green-100",
    },
    en_moderation: {
      label: "En modération",
      cls: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    },
    rejetee: {
      label: "Rejetée",
      cls: "bg-red-100 text-red-800 hover:bg-red-100",
    },
  };
  return <Badge className={map[status].cls}>{map[status].label}</Badge>;
}

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Tableau de bord
        </h1>
        <p className="text-sm text-muted-foreground">
          Vue d&apos;ensemble — {new Date().toLocaleDateString("fr-TN")}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((s) => (
          <Card key={s.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {s.title}
              </CardTitle>
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  s.trend === "up"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                <s.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                {s.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                <span
                  className={
                    s.trend === "up" ? "text-green-600" : "text-red-600"
                  }
                >
                  {s.change}
                </span>
                <span>vs mois dernier</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Utilisateurs récents</TabsTrigger>
          <TabsTrigger value="annonces">Annonces récentes</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Utilisateurs récents</CardTitle>
                <CardDescription>Les 5 derniers comptes créés</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href="/admin/users">Voir tout</a>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {USERS.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {u.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{u.name}</p>
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
                        <UserStatusBadge status={u.status} />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {u.date}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {u.status === "actif" ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-green-600 hover:text-green-600"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="annonces">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Annonces récentes</CardTitle>
                <CardDescription>
                  Modérez les annonces en attente
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href="/admin/annonces">Voir tout</a>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Annonce</TableHead>
                    <TableHead>Propriétaire</TableHead>
                    <TableHead>Loyer</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ANNONCES.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-medium">{a.titre}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {a.proprietaire}
                      </TableCell>
                      <TableCell className="font-medium">{a.loyer}</TableCell>
                      <TableCell>
                        <AnnonceStatusBadge status={a.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {a.status === "en_moderation" && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-green-600 hover:text-green-600"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
