"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Shield, Search, FileText, Star, MapPin } from "lucide-react";
import { T, useT } from "@/components/shared/TranslatedText";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { GoogleTranslate } from "@/components/shared/GoogleTranslate";

export default function LandingPage() {
  const router = useRouter();
  const t      = useT();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/annonces?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/annonces");
    }
  };

  return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="text-xl font-bold">🏠 ImmoPlat</span>
          <div className="flex items-center gap-3">
            
            <Button variant="outline" asChild>
              <Link href="/login">Se connecter</Link>
            </Button>
            <Button asChild>
              <Link href="/register">S&apos;inscrire</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero avec image de fond */}
      <section className="relative bg-gradient-to-br from-primary/10 to-primary/5 py-20 overflow-hidden">
        {/* Image de fond */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073"
            alt="Tunisie"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        
        {/* Contenu (inchangé) */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">
            <T k="home.hero_title" /><br/>
            <span className="text-primary">en Tunisie</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            <T k="home.hero_subtitle" />
          </p>

          {/* Search bar avec navigation */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder={t("home.search_placeholder")}
                  className="pl-10 h-14 text-base"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                />
              </div>
              <Button type="submit" size="lg" className="h-14 px-8">
                <Search className="mr-2 h-5 w-5" />
                <T k="nav.search" />
              </Button>
            </div>
          </form>

          {/* Quick filters */}
          <div className="flex flex-wrap gap-2 justify-center mt-6">
            {["Tunis", "Ariana", "La Marsa", "Sfax", "Sousse"].map(ville => (
              <Button
                key={ville}
                variant="secondary"
                size="sm"
                onClick={() => router.push(`/annonces?q=${ville}`)}
              >
                <MapPin className="mr-1 h-3 w-3" />
                {ville}
              </Button>
            ))}
          </div>

          <div className="flex gap-4 justify-center mt-8">
            <Button size="lg" variant="outline" asChild>
              <Link href="/annonces"><T k="home.see_annonces" /></Link>
            </Button>
            <Button size="lg" asChild>
              <Link href="/register"><T k="home.publish" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-8 text-center">
            {[
              { value: "500+", label: "Annonces actives" },
              { value: "1200+", label: "Utilisateurs" },
              { value: "300+", label: "Contrats signés" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-4xl font-bold text-primary">{s.value}</div>
                <div className="text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Pourquoi choisir ImmoPlat?</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Search,   title: "Recherche facile",       desc: "Filtrez par ville, type, prix et trouvez rapidement." },
              { icon: Shield,   title: "Annonces vérifiées",     desc: "Chaque annonce est modérée avant publication." },
              { icon: FileText, title: "Contrats PDF automatiques", desc: "Générez et signez vos contrats en ligne." },
              { icon: MapPin,   title: "Carte interactive",       desc: "Visualisez les annonces sur Google Maps." },
              { icon: Star,     title: "Simple et rapide",        desc: "Demandez une visite en quelques clics." },
              { icon: Home,     title: "Pour les propriétaires",  desc: "Gérez annonces, visites et contrats facilement." },
            ].map((f) => (
              <Card key={f.title}>
                <CardContent className="pt-6 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mx-auto mb-4">
                    <f.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à commencer?</h2>
          <p className="text-muted-foreground mb-8">Rejoignez des milliers d&apos;utilisateurs sur ImmoPlat</p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild><Link href="/register">Créer un compte gratuit</Link></Button>
            <Button size="lg" variant="outline" asChild><Link href="/annonces">Voir les annonces</Link></Button>
          </div>
        </div>
      </section>

      <footer className="border-t py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026 ImmoPlat — Plateforme de location en Tunisie
        </div>
      </footer>
    </div>
  );
}