const Footer = () => {
    return (
      <footer className="bg-black text-gray-400 py-8 mt-12">
        <div className="container mx-auto text-center">
          <h2 className="text-lg font-bold text-white">Evolusom</h2>
          <p className="mt-2">
            Transformando eventos em experiências únicas. Sonorização, iluminação e DJs profissionais.
          </p>
          <div className="mt-4 flex justify-center space-x-6">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              Facebook
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              Instagram
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              Twitter
            </a>
          </div>
          <p className="mt-6 text-sm text-gray-500">&copy; {new Date().getFullYear()} Evolusom. Todos os direitos reservados.</p>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  