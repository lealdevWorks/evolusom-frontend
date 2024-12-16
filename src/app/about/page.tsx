"use client";

import { useState } from "react";
import Image from "next/image";

const SobreNos = () => {
  const [isImageOpen, setIsImageOpen] = useState(false);

  const openImage = () => setIsImageOpen(true);
  const closeImage = () => setIsImageOpen(false);

  return (
    <main className="container mx-auto px-6 py-10">
      <div className="bg-gray-900 text-white rounded-lg shadow-lg p-6 relative">
        <h1 className="text-4xl font-bold text-center mb-6"></h1>

        {/* Seção principal */}
        <div className="flex flex-col items-center">
          {/* Imagem com clique para ampliar */}
          <div className="relative w-full max-w-3xl h-64 md:h-96 cursor-pointer">
            <Image
              src="/img/sobre-nos.jpg"
              alt="Equipe Evolusom trabalhando em um evento"
              layout="fill"
              objectFit="cover"
              className="rounded-lg shadow-lg"
              onClick={openImage}
            />
          </div>

          {/* Texto completo abaixo da imagem */}
          <div className="mt-8 text-lg text-center leading-relaxed max-w-3xl">
            <p>
              O nome <strong>"Evolusom"</strong> reflete muito bem a proposta da empresa
              de eventos, transmitindo a ideia de <strong>evolução</strong> constante no
              campo tecnológico do <strong>som</strong> e <strong>iluminação</strong>. A junção
              das palavras "Evolução" e "Som" cria uma <strong>identidade única</strong> e
              sugere que a empresa está sempre na vanguarda, buscando inovações e os
              melhores equipamentos para oferecer serviços{" "}
              <strong>modernos</strong> e <strong>eficientes</strong>.
            </p>
            <p className="mt-4">
              A escolha do símbolo da logo, que combina um <strong>raio</strong> e um{" "}
              <strong>espectro de áudio</strong>, é bastante significativa. Vamos analisar
              cada elemento:
            </p>

            {/* Raio */}
            <h2 className="text-xl font-semibold mt-6">Raio:</h2>
            <p className="mt-2">
              O raio sugere <strong>velocidade</strong>, <strong>energia</strong> e{" "}
              <strong>inovação</strong>. Ele transmite a ideia de que a empresa está à
              frente, pronta para proporcionar experiências excepcionais em eventos. Além
              disso, pode simbolizar a rapidez com que a empresa adota e implementa as
              últimas tecnologias.
            </p>

            {/* Espectro de Áudio */}
            <h2 className="text-xl font-semibold mt-6">Espectro de Áudio:</h2>
            <p className="mt-2">
              O espectro de áudio, representado visualmente, destaca a{" "}
              <strong>expertise</strong> da empresa no campo do som. Reflete a qualidade e
              a diversidade dos serviços oferecidos, mostrando que a Evolusom é capaz de
              lidar com uma ampla gama de eventos e estilos musicais.
            </p>

            {/* Conclusão */}
            <p className="mt-6">
              Ao unir esses <strong>dois elementos</strong>, você cria uma imagem que
              comunica dinamismo, tecnologia e excelência no setor de som e iluminação
              para eventos. A fusão deles no símbolo representa a capacidade da empresa de
              aliar <strong>tecnologia</strong> e <strong>experiência</strong> para
              proporcionar <strong>momentos únicos</strong> e elevar a identidade da
              Evolusom para a vanguarda do mercado.
            </p>
          </div>
        </div>
      </div>

      {/* Modal para abrir a imagem inteira */}
      {isImageOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <button
            onClick={closeImage}
            className="absolute top-6 right-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 z-50"
          >
            Fechar
          </button>
          <div className="relative max-w-full max-h-full flex items-center justify-center p-4">
            <img
              src="/img/sobre-nos.jpg"
              alt="Equipe Evolusom trabalhando em um evento"
              className="w-auto h-auto max-w-full max-h-[90vh] rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}
    </main>
  );
};

export default SobreNos;
