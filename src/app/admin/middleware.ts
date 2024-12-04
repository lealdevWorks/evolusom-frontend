import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('auth-token'); // Obtém o token de autenticação

  // Redireciona para login se não houver token e a rota começa com /admin
  if (req.nextUrl.pathname.startsWith('/admin') && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next(); // Prossegue normalmente se o token existir
}

export const config = {
  matcher: ['/admin/:path*'], // Aplica o middleware a todas as rotas que começam com /admin
};
