export default function Contato() {
    return (
      <main className="container mx-auto px-6 py-10">
        {/* Título */}
        <h1 className="text-3xl font-bold text-white">Entre em Contato</h1>
  
        {/* Descrição */}
        <p className="mt-4 text-gray-200">
          Preencha o formulário abaixo ou entre em contato via WhatsApp para mais informações.
        </p>
  
        {/* Formulário */}
        <form className="mt-6 bg-gray-900 p-6 rounded-lg shadow-lg">
          <div className="mb-4">
            <label className="block text-gray-200 font-medium mb-2" htmlFor="nome">
              Nome
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Seu nome"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-200 font-medium mb-2" htmlFor="email">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Seu e-mail"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-200 font-medium mb-2" htmlFor="mensagem">
              Mensagem
            </label>
            <textarea
              id="mensagem"
              name="mensagem"
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Sua mensagem"
              rows={5}
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Enviar
          </button>
        </form>
  
        {/* WhatsApp */}
        <div className="mt-6 text-center">
          <p className="text-gray-200">
            Ou entre em contato diretamente via{' '}
            <a
              href="https://wa.me/5511999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-500 hover:text-orange-600"
            >
              WhatsApp
            </a>
            .
          </p>
        </div>
      </main>
    );
  }
  