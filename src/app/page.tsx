'use client';

import DJSlider from '../components/DJSlider';

export default function Home() {
  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-20 py-10">
      {/* Banner de Boas-vindas */}
      <section className="bg-black text-white rounded-lg p-6 sm:p-10 lg:p-20 shadow-lg">
        <h1 className="text-2xl sm:text-4xl font-bold text-center">
          Bem-vindo à Evolusom
        </h1>
        <p className="mt-4 text-sm sm:text-lg text-center">
          Especialistas em sonorização para eventos. Garantimos qualidade, inovação e momentos inesquecíveis!
        </p>
        <div className="mt-6 text-center">
          <a
            href="/servicos"
            className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 shadow-md transition-colors"
          >
            Ver Serviços
          </a>
        </div>
      </section>

      {/* Slider de DJs */}
      <section className="mt-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 text-center">
          Conheça Nossos DJs
        </h2>
        <DJSlider />
      </section>
    </main>
  );
}
