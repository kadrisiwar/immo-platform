"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Home, CalendarCheck, FileText, TrendingUp } from "lucide-react";
import api from "@/lib/api";

export default function AdminStatistiquesPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await api.get("/accounts/stats/");
      return res.data;
    },
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Chargement...</div>
      </div>
    );

  const KPIS = [
    {
      label: "Total utilisateurs",
      value: stats?.total_users,
      icon: Users,
      color: "bg-blue-100 text-blue-700",
    },
    {
      label: "Total annonces",
      value: stats?.total_annonces,
      icon: Home,
      color: "bg-green-100 text-green-700",
    },
    {
      label: "Visites effectuées",
      value: stats?.total_visites,
      icon: CalendarCheck,
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      label: "Contrats générés",
      value: stats?.total_contrats,
      icon: FileText,
      color: "bg-purple-100 text-purple-700",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Statistiques globales
        </h1>
        <p className="text-sm text-muted-foreground">
          Vue d&apos;ensemble de la plateforme
        </p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {KPIS.map((k) => (
          <Card key={k.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {k.label}
              </CardTitle>
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${k.color}`}
              >
                <k.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{k.value ?? 0}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Répartition users */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Répartition utilisateurs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              {
                label: "Propriétaires",
                value: stats?.total_proprietaires ?? 0,
                total: stats?.total_users ?? 1,
                color: "bg-blue-500",
              },
              {
                label: "Locataires",
                value: stats?.total_locataires ?? 0,
                total: stats?.total_users ?? 1,
                color: "bg-green-500",
              },
            ].map((r) => (
              <div key={r.label} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{r.label}</span>
                  <span className="font-medium">
                    {r.value} ({Math.round((r.value / r.total) * 100) || 0}%)
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full">
                  <div
                    className={`h-2 ${r.color} rounded-full`}
                    style={{
                      width: `${Math.round((r.value / r.total) * 100) || 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Annonces par statut</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              {
                label: "Actives",
                value: stats?.annonces_actives ?? 0,
                total: stats?.total_annonces ?? 1,
                color: "bg-green-500",
              },
              {
                label: "En modération",
                value: stats?.annonces_moderation ?? 0,
                total: stats?.total_annonces ?? 1,
                color: "bg-yellow-500",
              },
            ].map((r) => (
              <div key={r.label} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{r.label}</span>
                  <span className="font-medium">
                    {r.value} ({Math.round((r.value / r.total) * 100) || 0}%)
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full">
                  <div
                    className={`h-2 ${r.color} rounded-full`}
                    style={{
                      width: `${Math.round((r.value / r.total) * 100) || 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visites</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              {
                label: "Confirmées",
                value: stats?.visites_confirmees ?? 0,
                total: stats?.total_visites ?? 1,
                color: "bg-green-500",
              },
              {
                label: "Total",
                value: stats?.total_visites ?? 0,
                total: stats?.total_visites ?? 1,
                color: "bg-blue-500",
              },
            ].map((r) => (
              <div key={r.label} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{r.label}</span>
                  <span className="font-medium">{r.value}</span>
                </div>
                <div className="h-2 bg-secondary rounded-full">
                  <div
                    className={`h-2 ${r.color} rounded-full`}
                    style={{
                      width: `${Math.round((r.value / r.total) * 100) || 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contrats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              {
                label: "Signés",
                value: stats?.contrats_signes ?? 0,
                total: stats?.total_contrats ?? 1,
                color: "bg-green-500",
              },
              {
                label: "Total",
                value: stats?.total_contrats ?? 0,
                total: stats?.total_contrats ?? 1,
                color: "bg-blue-500",
              },
            ].map((r) => (
              <div key={r.label} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{r.label}</span>
                  <span className="font-medium">{r.value}</span>
                </div>
                <div className="h-2 bg-secondary rounded-full">
                  <div
                    className={`h-2 ${r.color} rounded-full`}
                    style={{
                      width: `${Math.round((r.value / r.total) * 100) || 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
