import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type Role = "admin" | "proprietaire" | "locataire";

interface JwtPayload {
  user_id: number;
  role:    Role;
  exp:     number;
}

function parseJwt(token: string): JwtPayload | null {
  try {
    const base64  = token.split(".")[1];
    const padded  = base64 + "=".repeat((4 - base64.length % 4) % 4);
    const decoded = JSON.parse(atob(padded));
    if (decoded.exp * 1000 < Date.now()) return null;
    return decoded;
  } catch {
    return null;
  }
}

function getToken(request: NextRequest): JwtPayload | null {
  // 1 — Cookie (priorité)
  const cookieToken = request.cookies.get("access_token")?.value;
  if (cookieToken) {
    const payload = parseJwt(cookieToken);
    if (payload) return payload;
  }

  // 2 — Authorization header
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const payload = parseJwt(authHeader.slice(7));
    if (payload) return payload;
  }

  return null;
}

const PROTECTED: Record<string, Role[]> = {
  "/admin":        ["admin"],
  "/proprietaire": ["proprietaire"],
  "/locataire":    ["locataire"],
};

const AUTH_ROUTES = ["/login", "/register"];

const DASHBOARD: Record<Role, string> = {
  admin:        "/admin",
  proprietaire: "/proprietaire",
  locataire:    "/locataire",
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const payload      = getToken(request);

  // Connecté → redirige depuis auth pages
  if (AUTH_ROUTES.some(r => pathname.startsWith(r)) && payload) {
    return NextResponse.redirect(
      new URL(DASHBOARD[payload.role], request.url)
    );
  }

  // Route protégée
  const match = Object.entries(PROTECTED).find(([prefix]) =>
    pathname.startsWith(prefix)
  );

  if (match) {
    const [, roles] = match;

    if (!payload) {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    if (!roles.includes(payload.role)) {
      return NextResponse.redirect(
        new URL(DASHBOARD[payload.role], request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|ico)$).*)",
  ],
};