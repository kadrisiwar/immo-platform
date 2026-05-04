"use client";

import { useQuery } from "@tanstack/react-query";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Heart, CalendarCheck, Home } from "lucide-react";
import api from "@/lib/api";

export default function ProprietaireStatsPage() {
  const { data: annonces = [] } = useQuery({
    queryKey: ["mes-annonces"],
    queryFn:  async () => { const r = await api.get("/annonces/mes-annonces/"); return r.data; },
  });

  const { data: visites = [] } = useQuery({
    queryKey: ["visites-proprietaire"],
    queryFn:  async () => { const r = await api.get("/visites/proprietaire/"); return r.data; },
  });

  // Données graphiques
  const visitesParMois = Array.from({ length: 6 }, (_, i) => {
    const d     = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const mois  = d.toLocaleDateString("fr-TN", { month: "short" });
    const count = visites.filter((v: any) => {
      const vd = new Date(v.created_at);
      return vd.getMonth() === d.getMonth() && vd.getFullYear() === d.getFullYear();
    }).length;
    return { mois, visites: count };
  });

  const annoncesParStatut = [
    { name: "Actives",        value: annonces.filter((a: any) => a.status === "active").length,        color: "#10b981" },
    { name: "En modération",  value: annonces.filter((a: any) => a.status === "en_moderation").length, color: "#f59e0b" },
    { name: "Suspendues",     value: annonces.filter((a: any) => a.status === "suspendue").length,     color: "#6b7280" },
    { name: "Rejetées",       value: annonces.filter((a: any) => a.status === "rejetee").length,       color: "#ef4444" },
  ].filter(d => d.value > 0);

  const stats = [
    { label: "Total annonces", value: annonces.length,                                             icon: Home,          color: "bg-blue-100 text-blue-700" },
    { label: "Annonces actives", value: annonces.filter((a: any) => a.status === "active").length, icon: Eye,           color: "bg-green-100 text-green-700" },
    { label: "Total visites",  value: visites.length,                                              icon: CalendarCheck, color: "bg-yellow-100 text-yellow-700" },
    { label: "Visites confirmées", value: visites.filter((v: any) => v.status === "confirmee").length, icon: Heart,    color: "bg-purple-100 text-purple-700" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Mes statistiques</h1>
        <p className="text-sm text-muted-foreground">Performance de vos annonces</p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(s => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${s.color}`}>
                <s.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        {/* Graphique visites */}
        <Card>
          <CardHeader><CardTitle>Visites par mois</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={visitesParMois}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="mois" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Area
                  type="monotone" dataKey="visites"
                  stroke="#2563eb" fill="#2563eb20"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie chart statuts */}
        <Card>
          <CardHeader><CardTitle>Répartition annonces</CardTitle></CardHeader>
          <CardContent>
            {annoncesParStatut.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                Aucune annonce
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={annoncesParStatut}
                    cx="50%" cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    {annoncesParStatut.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Performance annonces */}
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Performance par annonce</CardTitle></CardHeader>
          <CardContent>
            {annonces.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-muted-foreground">
                Aucune annonce
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={annonces.slice(0, 8).map((a: any) => ({
                  name:    a.titre.slice(0, 20) + (a.titre.length > 20 ? "..." : ""),
                  visites: visites.filter((v: any) => v.annonce === a.id).length,
                }))}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Bar dataKey="visites" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}