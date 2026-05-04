"use client";

import { useQuery } from "@tanstack/react-query";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Users, Home, CalendarCheck, FileText } from "lucide-react";
import api from "@/lib/api";

const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function AdminStatistiquesPage() {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn:  async () => { const r = await api.get("/accounts/stats/"); return r.data; },
  });

  const { data: annonces = [] } = useQuery({
    queryKey: ["admin-annonces"],
    queryFn:  async () => { const r = await api.get("/annonces/admin/all/"); return r.data; },
  });

  const { data: users = [] } = useQuery({
    queryKey: ["admin-users"],
    queryFn:  async () => { const r = await api.get("/accounts/users/"); return r.data; },
  });

  // Export Excel
  const exportExcel = async () => {
    const XLSX = await import("xlsx");
    const wb   = XLSX.utils.book_new();

    // Sheet 1 — Stats globales
    const statsData = [
      ["Métrique", "Valeur"],
      ["Total utilisateurs",    stats?.total_users],
      ["Propriétaires",         stats?.total_proprietaires],
      ["Locataires",            stats?.total_locataires],
      ["Total annonces",        stats?.total_annonces],
      ["Annonces actives",      stats?.annonces_actives],
      ["Total visites",         stats?.total_visites],
      ["Visites confirmées",    stats?.visites_confirmees],
      ["Total contrats",        stats?.total_contrats],
      ["Contrats signés",       stats?.contrats_signes],
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(statsData), "Statistiques");

    // Sheet 2 — Annonces
    const annoncesData = [
      ["ID", "Titre", "Ville", "Loyer", "Statut", "Propriétaire", "Date"],
      ...annonces.map((a: any) => [
        a.id, a.titre, a.ville, a.loyer,
        a.status, a.proprietaire_nom,
        new Date(a.created_at).toLocaleDateString("fr-TN"),
      ]),
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(annoncesData), "Annonces");

    // Sheet 3 — Utilisateurs
    const usersData = [
      ["ID", "Username", "Email", "Rôle", "Actif", "Date inscription"],
      ...users.map((u: any) => [
        u.id, u.username, u.email, u.role,
        u.is_active ? "Oui" : "Non",
        new Date(u.date_joined).toLocaleDateString("fr-TN"),
      ]),
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(usersData), "Utilisateurs");

    XLSX.writeFile(wb, `ImmoPlat_Stats_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  const kpis = [
    { label: "Utilisateurs",       value: stats?.total_users,         icon: Users,        color: "bg-blue-100 text-blue-700" },
    { label: "Annonces",           value: stats?.total_annonces,       icon: Home,         color: "bg-green-100 text-green-700" },
    { label: "Visites",            value: stats?.total_visites,        icon: CalendarCheck,color: "bg-yellow-100 text-yellow-700" },
    { label: "Contrats",           value: stats?.total_contrats,       icon: FileText,     color: "bg-purple-100 text-purple-700" },
  ];

  const repartitionUsers = [
    { name: "Propriétaires", value: stats?.total_proprietaires || 0 },
    { name: "Locataires",    value: stats?.total_locataires    || 0 },
  ];

  const repartitionAnnonces = [
    { name: "Actives",       value: stats?.annonces_actives    || 0 },
    { name: "En modération", value: stats?.annonces_moderation || 0 },
  ];

  const annoncesParVille = annonces.reduce((acc: any, a: any) => {
    acc[a.ville] = (acc[a.ville] || 0) + 1;
    return acc;
  }, {});
  const villeData = Object.entries(annoncesParVille)
    .map(([ville, count]) => ({ ville, count }))
    .sort((a: any, b: any) => b.count - a.count)
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Statistiques globales</h1>
          <p className="text-sm text-muted-foreground">Vue d'ensemble de la plateforme</p>
        </div>
        <Button onClick={exportExcel} variant="outline">
          <Download className="mr-2 h-4 w-4" /> Exporter Excel
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map(k => (
          <Card key={k.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <p className="text-sm text-muted-foreground">{k.label}</p>
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${k.color}`}>
                <k.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{k.value ?? 0}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        {/* Annonces par ville */}
        <Card>
          <CardHeader><CardTitle>Annonces par ville</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={villeData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="ville" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Bar dataKey="count" name="Annonces" fill="#2563eb" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Répartition users */}
        <Card>
          <CardHeader><CardTitle>Répartition utilisateurs</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={repartitionUsers} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({name,value}) => `${name}: ${value}`}>
                  {repartitionUsers.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Répartition annonces */}
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Statut des annonces</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {repartitionAnnonces.map((item, i) => (
                <div key={item.name} className="flex items-center gap-3 p-4 rounded-xl border">
                  <div className="h-4 w-4 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <div>
                    <p className="font-medium">{item.value}</p>
                    <p className="text-sm text-muted-foreground">{item.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}