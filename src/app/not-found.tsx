import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center flex-col gap-6 text-center px-4">
      <div className="text-8xl font-bold text-primary/20">404</div>
      <div>
        <h1 className="text-2xl font-bold mb-2">Page introuvable</h1>
        <p className="text-muted-foreground">La page que vous cherchez n&apos;existe pas.</p>
      </div>
      <Button asChild>
        <Link href="/"><Home className="mr-2 h-4 w-4" />Retour à l&apos;accueil</Link>
      </Button>
    </div>
  );
}