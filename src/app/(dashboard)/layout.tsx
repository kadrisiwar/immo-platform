"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, Users, Home, CalendarCheck,
  FileText, MessageSquare, Bell, BarChart3,
  AlertTriangle, ChevronLeft, Menu, LogOut, Heart,
  CheckCheck, Clock,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/hooks/use-notifications";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

type Role = "admin" | "proprietaire" | "locataire";

const NAV: Record<Role, { label: string; href: string; icon: any; badge?: number }[]> = {
  admin: [
    { label: "Vue d'ensemble",  href: "/admin",              icon: LayoutDashboard },
    { label: "Utilisateurs",    href: "/admin/users",        icon: Users },
    { label: "Annonces",        href: "/admin/annonces",     icon: Home },
    { label: "Statistiques",    href: "/admin/statistiques", icon: BarChart3 },
    { label: "Litiges",         href: "/admin/litiges",      icon: AlertTriangle },
    { label: "Paramètres",      href: "/admin/settings",     icon: Settings },
  ],
  proprietaire: [
    { label: "Tableau de bord", href: "/proprietaire",               icon: LayoutDashboard },
    { label: "Mes annonces",    href: "/proprietaire/annonces",      icon: Home },
    { label: "Visites",         href: "/proprietaire/visites",       icon: CalendarCheck },
    { label: "Contrats",        href: "/proprietaire/contrats",      icon: FileText },
    { label: "Messages",        href: "/proprietaire/messages",      icon: MessageSquare },
    { label: "Statistiques",    href: "/proprietaire/statistiques",  icon: BarChart3 },
  ],
  locataire: [
    { label: "Tableau de bord", href: "/locataire",          icon: LayoutDashboard },
    { label: "Mes visites",     href: "/locataire/visites",  icon: CalendarCheck },
    { label: "Favoris",         href: "/locataire/favoris",  icon: Heart },
    { label: "Contrats",        href: "/locataire/contrats", icon: FileText },
    { label: "Messages",        href: "/locataire/messages", icon: MessageSquare },
  ],
};

const ROLE_LABELS: Record<Role, string> = {
  admin:        "Administrateur",
  proprietaire: "Propriétaire",
  locataire:    "Locataire",
};

const ROLE_INITIALS: Record<Role, string> = {
  admin:        "AD",
  proprietaire: "PR",
  locataire:    "LO",
};

function NotificationIcon({ type }: { type: string }) {
  if (type === "visite")     return <CalendarCheck className="h-4 w-4 text-blue-500 shrink-0" />;
  if (type === "moderation") return <Home className="h-4 w-4 text-yellow-500 shrink-0" />;
  if (type === "annonce")    return <CheckCheck className="h-4 w-4 text-green-500 shrink-0" />;
  return <Bell className="h-4 w-4 text-muted-foreground shrink-0" />;
}

function SidebarContent({ role, collapsed, onToggle }: {
  role: Role; collapsed: boolean; onToggle: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b p-4">
        {!collapsed && (
          <span className="text-lg font-semibold">
            {role === "admin" ? "🏢 Admin" : "🏠 ImmoPlat"}
          </span>
        )}
        <Button variant="ghost" size="icon" onClick={onToggle} className="hidden lg:flex">
          <ChevronLeft className={cn("h-4 w-4 transition-transform duration-200", collapsed && "rotate-180")} />
        </Button>
      </div>

      <nav className="flex-1 space-y-1 p-2 pt-4">
        {NAV[role].map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href}>
              <span className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                isActive ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground",
                collapsed && "justify-center px-2"
              )}>
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <Badge variant="destructive" className="h-5 px-1.5 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className={cn("w-full justify-start gap-3", collapsed && "justify-center px-2")}>
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                  {ROLE_INITIALS[role]}
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="flex flex-col items-start text-xs">
                  <span className="font-medium">{ROLE_LABELS[role]}</span>
                  <span className="text-muted-foreground">Voir profil</span>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link href={`/${role}/profil`}>Mon profil</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
  className="text-destructive"
  onClick={() => {
    // Supprimer localStorage
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    // Supprimer cookie
    document.cookie = "access_token=; path=/; max-age=0; SameSite=Lax";
    window.location.href = "/login";
  }}
>
  <LogOut className="mr-2 h-4 w-4" />
  Déconnexion
</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const role: Role = pathname.startsWith("/admin")
    ? "admin"
    : pathname.startsWith("/locataire")
    ? "locataire"
    : "proprietaire";

  const [collapsed, setCollapsed] = useState(false);
  const { data: notifData, refetch } = useNotifications();
  const notifications = notifData?.notifications || [];
  const nonLus        = notifData?.non_lus ?? 0;

  return (
    <div className="flex bg-background" style={{ minHeight: "100vh" }}>
      {/* Sidebar desktop */}
      <aside className={cn(
        "hidden lg:flex flex-col border-r bg-card transition-all duration-200 shrink-0",
        collapsed ? "w-16" : "w-64"
      )}>
        <div className="sticky top-0 h-screen overflow-y-auto">
          <SidebarContent role={role} collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
        </div>
      </aside>

      <div className="flex flex-1 flex-col min-w-0">
        {/* Navbar */}
        <header className="flex h-14 items-center gap-4 border-b bg-card px-6 sticky top-0 z-10">
          {/* Mobile hamburger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex h-full flex-col">
                <div className="p-4 border-b">
                  <span className="text-lg font-semibold">
                    {role === "admin" ? "🏢 Admin" : "🏠 ImmoPlat"}
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <SidebarContent role={role} collapsed={false} onToggle={() => {}} />
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex-1" />
          <ThemeToggle />

          {/* Notifications dropdown */}
          <DropdownMenu onOpenChange={(open) => open && refetch()}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <div className="relative">
                  <Bell className="h-5 w-5" />
                  {nonLus > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-white font-bold">
                      {nonLus > 9 ? "9+" : nonLus}
                    </span>
                  )}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                {nonLus > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {nonLus} non lues
                  </Badge>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {notifications.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p>Aucune notification</p>
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((n: any) => (
                    <DropdownMenuItem key={n.id} className="flex items-start gap-3 p-3 cursor-default">
                      <NotificationIcon type={n.type} />
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-xs leading-tight", !n.lu && "font-semibold")}>
                          {n.message}
                        </p>
                        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(n.date).toLocaleString("fr-TN", {
                            day: "2-digit",
                            month: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                      {!n.lu && <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" />}
                    </DropdownMenuItem>
                  ))}
                </div>
              )}

              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center text-xs text-muted-foreground justify-center">
                {role === "proprietaire" && (
                  <Link href="/proprietaire/visites" className="text-primary hover:underline">
                    Voir toutes les visites →
                  </Link>
                )}
                {role === "admin" && (
                  <Link href="/admin/annonces" className="text-primary hover:underline">
                    Voir les annonces en attente →
                  </Link>
                )}
                {role === "locataire" && (
                  <Link href="/locataire/visites" className="text-primary hover:underline">
                    Voir mes visites →
                  </Link>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 p-6 pb-20">{children}</main>
      </div>
    </div>
  );
}