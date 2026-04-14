import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Shield, Search, FileText, Star, MapPin } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="text-xl font-bold">🏠 ImmoPlat</span>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/login">Se connecter</Link>
            </Button>
            <Button asChild>
              <Link href="/register">S&apos;inscrire</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Trouvez votre logement idéal
            <br />
            <span className="text-primary">en Tunisie</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            La plateforme de location longue durée qui connecte propriétaires et
            locataires
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/annonces">
                <Search className="mr-2 h-5 w-5" />
                Chercher un logement
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/register">Publier une annonce</Link>
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
          <h2 className="text-3xl font-bold text-center mb-12">
            Pourquoi choisir ImmoPlat?
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Search,
                title: "Recherche facile",
                desc: "Filtrez par ville, type, prix et trouvez rapidement.",
              },
              {
                icon: Shield,
                title: "Annonces vérifiées",
                desc: "Chaque annonce est modérée avant publication.",
              },
              {
                icon: FileText,
                title: "Contrats digitaux",
                desc: "Signez vos contrats en ligne en toute sécurité.",
              },
              {
                icon: MapPin,
                title: "Partout en Tunisie",
                desc: "Tunis, Ariana, Sfax, Sousse et plus encore.",
              },
              {
                icon: Star,
                title: "Simple et rapide",
                desc: "Demandez une visite en quelques clics.",
              },
              {
                icon: Home,
                title: "Pour les propriétaires",
                desc: "Gérez vos annonces, visites et contrats facilement.",
              },
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
          <p className="text-muted-foreground mb-8">
            Rejoignez des milliers d&apos;utilisateurs sur ImmoPlat
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/register">Créer un compte gratuit</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/annonces">Voir les annonces</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026 ImmoPlat — Plateforme de location en Tunisie
        </div>
      </footer>
    </div>
  );
}
