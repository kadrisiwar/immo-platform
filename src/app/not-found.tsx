import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8">
        <div className="text-8xl font-black text-primary/20">404</div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Page introuvable</h1>
          <p className="text-muted-foreground max-w-md">
            La page que vous recherchez n&apos;existe pas ou a été déplacée.
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" asChild>
            <Link href="javascript:history.back()">
              <ArrowLeft className="mr-2 h-4 w-4" /> Retour
            </Link>
          </Button>
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" /> Accueil
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}