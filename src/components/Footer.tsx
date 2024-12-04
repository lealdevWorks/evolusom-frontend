const Footer = () => {
    return (
      <footer className="bg-black text-gray-400 py-8 mt-12">
        <div className="container mx-auto text-center px-4 sm:px-6 lg:px-20">
          {/* Nome e Descrição */}
          <h2 className="text-lg sm:text-xl font-bold text-white">Evolusom</h2>
          <p className="mt-2 text-sm sm:text-base leading-relaxed">
            Transformando eventos em experiências únicas. Sonorização, iluminação e DJs profissionais.
          </p>
  
          {/* Links para Redes Sociais */}
          <div className="mt-4 flex justify-center space-x-6">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Facebook
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Twitter
            </a>
          </div>
  
          {/* Direitos Autorais */}
          <p className="mt-6 text-xs sm:text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Evolusom. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  