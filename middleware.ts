import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Simple in-memory storage for rate limiting (per instance)
const rateLimit = new Map<string, { count: number; lastReset: number }>();

export default withAuth(
  function middleware(req) {
    const ip = req.ip || "anonymous";
    const now = Date.now();
    const timeframe = 60 * 1000; // 1 minute
    const limit = 5; // 5 requests per minute

    // Redirecciones Legado -> /admin/*
    const legacyRoutes = ['/pacientes', '/agenda', '/finanzas', '/consulta'];
    const matchingLegacy = legacyRoutes.find(route => req.nextUrl.pathname.startsWith(route));
    
    if (matchingLegacy && !req.nextUrl.pathname.startsWith('/admin')) {
      const newPath = `/admin${req.nextUrl.pathname}`;
      return NextResponse.redirect(new URL(newPath, req.url));
    }

    // Apply rate limit specifically to the checkout API
    if (req.nextUrl.pathname.startsWith("/api/checkout")) {
      const entry = rateLimit.get(ip) || { count: 0, lastReset: now };
      
      if (now - entry.lastReset > timeframe) {
        entry.count = 0;
        entry.lastReset = now;
      }
      
      entry.count++;
      rateLimit.set(ip, entry);

      if (entry.count > limit) {
        return new NextResponse("Demasiadas solicitudes. Reintente en un minuto.", { status: 429 });
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Rutas que SIEMPRE requieren autenticación
        if (pathname.startsWith('/admin')) {
          return !!token;
        }

        // Por defecto, permitir (las rutas públicas no están en el matcher o se filtran aquí)
        return true;
      },
    },
    pages: {
      signIn: '/login',
    }
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/checkout/:path*",
    "/pacientes/:path*",
    "/agenda/:path*",
    "/finanzas/:path*",
    "/consulta/:path*"
  ],
};
