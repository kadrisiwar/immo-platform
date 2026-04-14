import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type Role = "admin" | "proprietaire" | "locataire";

interface JwtPayload {
  user_id: number;
  role: Role;
  exp: number;
}

function getTokenPayload(request: NextRequest): JwtPayload | null {
  const token = request.cookies.get("access_token")?.value;
  if (!token) return null;
  try {
    const base64 = token.split(".")[1];
    const payload = JSON.parse(atob(base64));
    if (payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

const PROTECTED: Record<string, Role[]> = {
  "/admin": ["admin"],
  "/proprietaire": ["proprietaire"],
  "/locataire": ["locataire"],
};

const AUTH_ROUTES = ["/login", "/register"];

const DASHBOARD: Record<Role, string> = {
  admin: "/admin",
  proprietaire: "/proprietaire",
  locataire: "/locataire",
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const payload = getTokenPayload(request);

  if (AUTH_ROUTES.some((r) => pathname.startsWith(r)) && payload) {
    return NextResponse.redirect(new URL(DASHBOARD[payload.role], request.url));
  }

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
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg)$).*)",
  ],
};
