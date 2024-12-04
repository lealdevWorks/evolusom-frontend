import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('auth-token'); // Obtém o token de autenticação

  if (req.nextUrl.pathname.startsWith('/admin') && !token) {
    return NextResponse.redirect(new URL('/login', req.url)); // Redireciona para login se não autenticado
  }

  return NextResponse.next(); // Prossegue normalmente
}

export const config = {
  matcher: ['/admin/:path*'], // Aplica o middleware às rotas que começam com /admin
};
