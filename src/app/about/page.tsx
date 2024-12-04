'use client';

import { useState } from 'react';

export default function About() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-20 py-10">
      <section className="text-center">
        {/* Título */}
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-8">Sobre Nós</h1>

        {/* Conteúdo */}
        <div className="flex flex-col items-center gap-8">
          {/* Imagem */}
          <div>
            <img
              src="/img/sobre-nos.jpg"
              alt="Descrição Evolusom"
              className="rounded-lg shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setIsModalOpen(true)}
            />
          </div>

          {/* Modal para Ampliar Imagem */}
          {isModalOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 transition-opacity duration-300"
              onClick={() => setIsModalOpen(false)}
            >
              <div className="relative">
                {/* Botão Fechar */}
                <button
                  className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-80"
                  onClick={() => setIsModalOpen(false)}
                >
                  ✕
                </button>

                {/* Imagem Ampliada */}
                <img
                  src="/img/sobre-nos.jpg"
                  alt="Descrição Evolusom"
                  className="rounded-lg max-w-4xl max-h-[90%] shadow-lg"
                />
              </div>
            </div>
          )}

          {/* Texto */}
          <div className="text-gray-300 leading-relaxed max-w-3xl mx-auto">
            <p>
              O nome <span className="text-white font-bold">"Evolusom"</span> reflete muito bem a proposta da empresa de
              eventos, transmitindo a ideia de <span className="text-orange-500 font-bold">evolução</span> constante no
              campo tecnológico do som e iluminação. A junção das palavras <span className="font-bold">"Evolução"</span> e
              <span className="font-bold">"Som"</span> cria uma identidade única e sugere que a empresa está sempre na
              vanguarda, buscando inovações e os melhores equipamentos para oferecer serviços modernos e eficientes.
            </p>
            <p className="mt-4">
              A escolha do símbolo do logo, que combina um{' '}
              <span className="font-bold text-orange-500">raio</span> e um{' '}
              <span className="font-bold text-orange-500">espectro de áudio</span>, é bastante significativa.
            </p>
            <p className="mt-4">
              <strong>Raio:</strong> O raio sugere velocidade, energia e inovação. Ele transmite a ideia de que a empresa
              está à frente, pronta para proporcionar experiências excepcionais em eventos. Além disso, pode simbolizar a
              rapidez com que a empresa adota e implementa as últimas tecnologias.
            </p>
            <p className="mt-4">
              <strong>Espectro de Áudio:</strong> O espectro de áudio, representado visualmente, destaca a expertise da
              empresa no campo do som. Reflete a qualidade e a diversidade dos serviços oferecidos, ressaltando que a
              Evolusom é capaz de lidar com uma ampla gama de eventos e estilos musicais.
            </p>
            <p className="mt-4">
              Ao unir esses dois elementos, você cria uma imagem que comunica dinamismo, tecnologia e excelência no setor
              de sonorização e iluminação para eventos.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
