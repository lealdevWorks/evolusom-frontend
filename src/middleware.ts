import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('auth-token'); // Obtém o token de autenticação

  // Protege rotas administrativas, exceto a rota de login
  if (
    req.nextUrl.pathname.startsWith('/admin') &&
    req.nextUrl.pathname !== '/admin/login' &&
    !token
  ) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  return NextResponse.next(); // Prossegue normalmente
}

export const config = {
  matcher: ['/admin/:path*'], // Middleware aplicado às rotas que começam com /admin
};
