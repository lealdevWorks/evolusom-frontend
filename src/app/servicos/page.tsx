export default function Servicos() {
    const servicos = [
      {
        titulo: 'Sonorização Completa',
        descricao: 'Equipamentos de som profissionais para qualquer evento.',
        imagem: '/img/sonorizacao.jpg',
      },
      {
        titulo: 'Iluminação',
        descricao: 'Luzes cênicas e efeitos especiais para valorizar seu evento.',
        imagem: '/img/iluminacao.jpg',
      },
      {
        titulo: 'DJ para Eventos',
        descricao: 'DJs profissionais para animar sua festa.',
        imagem: '/img/dj.jpg',
      },
    ];
  
    return (
      <main className="container mx-auto px-4 sm:px-6 lg:px-20 py-10">
        {/* Título da seção */}
        <h1 className="text-3xl sm:text-4xl font-bold text-white text-center">Nossos Serviços</h1>
  
        {/* Texto explicativo */}
        <p className="mt-4 text-gray-300 text-center max-w-3xl mx-auto">
          Descubra nossos serviços de sonorização, iluminação e DJs profissionais para transformar seu evento em uma
          experiência inesquecível.
        </p>
  
        {/* Lista de serviços */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          {servicos.map((servico, index) => (
            <div
              key={index}
              className="bg-gray-900 text-gray-300 shadow-lg rounded-lg overflow-hidden hover:scale-105 hover:shadow-xl transition-transform"
            >
              <img
                src={servico.imagem}
                alt={servico.titulo}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2 className="text-xl font-bold text-white">{servico.titulo}</h2>
                <p className="mt-4">{servico.descricao}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }
  