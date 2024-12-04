import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
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

        {/* Menu de Navegação */}
        <nav>
          <ul className="flex space-x-6">
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
