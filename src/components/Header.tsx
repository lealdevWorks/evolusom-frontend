'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { FiShoppingCart } from 'react-icons/fi';
import { signIn, signOut, useSession } from 'next-auth/react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (pathname === '/admin/login') {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('auth-token='))?.split('=')[1];

      if (token === 'valid') {
        router.push('/admin/dashboard');
      }
    }
  }, [pathname, router]);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'Sobre Nós' },
    { href: '/servicos', label: 'Serviços' },
    { href: '/eventos', label: 'Eventos' },
    { href: '/contato', label: 'Contato' },
    { href: '/admin/login', label: 'Entrar' },
  ];

  return (
    <header className="bg-black text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <Link href="/">
          <Image
            src="/img/logo.png"
            alt="Logo Evolusom"
            width={120}
            height={40}
            className="hover:scale-105 transition-transform cursor-pointer"
            priority
          />
        </Link>

        <div className="flex items-center space-x-6">
          <nav className="hidden sm:flex space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${
                  pathname === link.href
                    ? 'text-orange-500 font-semibold'
                    : 'hover:text-gray-400 transition-colors'
                }`}
                aria-current={pathname === link.href ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link href="/carrinho" aria-label="Carrinho">
            <FiShoppingCart className="text-2xl hover:text-orange-500 transition-colors cursor-pointer" />
          </Link>

          <button
            className="text-white text-2xl sm:hidden focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Alternar menu"
          >
            ☰
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav className="sm:hidden bg-black text-white px-6 py-4 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block ${
                pathname === link.href
                  ? 'text-orange-500 font-semibold'
                  : 'hover:text-orange-500 transition-colors'
              }`}
              aria-current={pathname === link.href ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}

      {/* Exibir botão de login apenas em eventos, agora menor e alinhado à direita */}
      {pathname === '/eventos' && (
        <div className="flex justify-between items-center mb-6">
          <div className="flex-grow" /> {/* Para empurrar o botão para a direita */}
          {!session ? (
            <button
              onClick={() => signIn('google')}
              className="bg-orange-500 text-white text-sm px-3 py-1 rounded hover:bg-orange-600 transition duration-200 mr-4" // Adicionando margem à direita
            >
              Login
            </button>
          ) : (
            <div className="flex items-center">
              <p className="text-white text-sm mr-2">Bem-vindo, {session.user?.name}!</p>
              <button
                onClick={() => signOut()}
                className="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600 transition duration-200 mr-4" // Adicionando margem à direita
              >
                Sair
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;