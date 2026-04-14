"use client";

import { useNotifications } from "@/hooks/use-notifications";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Home,
  CalendarCheck,
  FileText,
  MessageSquare,
  Bell,
  BarChart3,
  AlertTriangle,
  ChevronLeft,
  Menu,
  LogOut,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type Role = "admin" | "proprietaire" | "locataire";

const NAV: Record<
  Role,
  { label: string; href: string; icon: any; badge?: number }[]
> = {
  admin: [
    { label: "Vue d'ensemble", href: "/admin", icon: LayoutDashboard },
    { label: "Utilisateurs", href: "/admin/users", icon: Users },
    { label: "Annonces", href: "/admin/annonces", icon: Home },
    { label: "Statistiques", href: "/admin/statistiques", icon: BarChart3 },
    { label: "Litiges", href: "/admin/litiges", icon: AlertTriangle, badge: 3 },
  ],
  proprietaire: [
    { label: "Tableau de bord", href: "/proprietaire", icon: LayoutDashboard },
    { label: "Mes annonces", href: "/proprietaire/annonces", icon: Home },
    { label: "Visites", href: "/proprietaire/visites", icon: CalendarCheck },
    { label: "Contrats", href: "/proprietaire/contrats", icon: FileText },
    { label: "Messages", href: "/proprietaire/messages", icon: MessageSquare },
  ],
  locataire: [
    { label: "Tableau de bord", href: "/locataire", icon: LayoutDashboard },
    { label: "Mes visites", href: "/locataire/visites", icon: CalendarCheck },
    { label: "Favoris", href: "/locataire/favoris", icon: Heart },
    { label: "Contrats", href: "/locataire/contrats", icon: FileText },
  ],
};

const ROLE_LABELS: Record<Role, string> = {
  admin: "Administrateur",
  proprietaire: "Propriétaire",
  locataire: "Locataire",
};

const ROLE_INITIALS: Record<Role, string> = {
  admin: "AD",
  proprietaire: "PR",
  locataire: "LO",
};

function SidebarContent({
  role,
  collapsed,
  onToggle,
}: {
  role: Role;
  collapsed: boolean;
  onToggle: () => void;
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
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="hidden lg:flex"
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              collapsed && "rotate-180"
            )}
          />
        </Button>
      </div>

      <nav className="flex-1 space-y-1 p-2 pt-4">
        {NAV[role].map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href}>
              <span
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  isActive
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-muted-foreground",
                  collapsed && "justify-center px-2"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <Badge
                        variant="destructive"
                        className="h-5 px-1.5 text-xs"
                      >
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
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3",
                collapsed && "justify-center px-2"
              )}
            >
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
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const role: Role = pathname.startsWith("/admin")
    ? "admin"
    : pathname.startsWith("/locataire")
    ? "locataire"
    : "proprietaire";
  const [collapsed, setCollapsed] = useState(false);
  const { data: notifData } = useNotifications();
  const nonLus = notifData?.non_lus ?? 0;

  return (
    <div className="flex bg-background" style={{ minHeight: "100vh" }}>
      <aside
        className={cn(
          "hidden lg:flex flex-col border-r bg-card transition-all duration-200 shrink-0",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <div className="sticky top-0 h-screen overflow-y-auto">
          <SidebarContent
            role={role}
            collapsed={collapsed}
            onToggle={() => setCollapsed(!collapsed)}
          />
        </div>
      </aside>

      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex h-14 items-center gap-4 border-b bg-card px-6 sticky top-0 z-10">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SidebarContent
                role={role}
                collapsed={false}
                onToggle={() => {}}
              />
            </SheetContent>
          </Sheet>
          <div className="flex-1" />
          <div className="relative">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {nonLus > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-white font-bold">
                  {nonLus > 9 ? "9+" : nonLus}
                </span>
              )}
            </Button>
          </div>
        </header>

        <main className="flex-1 p-6 pb-20">{children}</main>
      </div>
    </div>
  );
}
