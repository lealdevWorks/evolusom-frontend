'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          />
        </Link>

        {/* Botão de Hambúrguer para telas pequenas */}
        <button
          className="text-white text-2xl sm:hidden focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>

        {/* Menu de Navegação */}
        <nav
          className={`${
            isMenuOpen ? 'block' : 'hidden'
          } absolute top-full left-0 w-full bg-black sm:static sm:flex sm:space-x-6 sm:w-auto sm:bg-transparent`}
        >
          <ul className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 py-4 sm:py-0">
            <li>
              <Link href="/" className="hover:text-gray-400 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-gray-400 transition-colors">
                Sobre Nós
              </Link>
            </li>
            <li>
              <Link href="/servicos" className="hover:text-gray-400 transition-colors">
                Serviços
              </Link>
            </li>
            <li>
              <Link href="/contato" className="hover:text-gray-400 transition-colors">
                Contato
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
