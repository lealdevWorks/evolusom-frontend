'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FiShoppingCart } from 'react-icons/fi';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname(); // Para identificar a rota ativa

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'Sobre Nós' },
    { href: '/servicos', label: 'Serviços' },
    { href: '/contato', label: 'Contato' },
  ];

  return (
    <header className="bg-black text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logotipo */}
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

        {/* Navegação e Ícone do Carrinho */}
        <div className="flex items-center space-x-6">
          {/* Menu de Navegação */}
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

          {/* Ícone do Carrinho */}
          <Link href="/carrinho" aria-label="Carrinho">
            <FiShoppingCart className="text-2xl hover:text-orange-500 transition-colors cursor-pointer" />
          </Link>

          {/* Botão de Hambúrguer para telas pequenas */}
          <button
            className="text-white text-2xl sm:hidden focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Alternar menu"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Menu de navegação móvel */}
      {isMenuOpen && (
        <nav className="sm:hidden bg-black text-white px-6 py-4 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block hover:text-orange-500 transition-colors"
              aria-current={pathname === link.href ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;
