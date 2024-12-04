import DJSlider from '../components/DJSlider';

export default function Home() {
  return (
    <main className="container mx-auto px-6 py-10">
      {/* Banner de Boas-vindas */}
      <section className="bg-black text-white rounded-lg p-10 shadow-lg">
        <h1 className="text-4xl font-bold">Bem-vindo à Evolusom</h1>
        <p className="mt-4 text-lg">
          Especialistas em sonorização para eventos. Garantimos qualidade, inovação e momentos inesquecíveis!
        </p>
        <div className="mt-6">
          <a
            href="/servicos"
            className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 shadow-md transition-colors"
          >
            Ver Serviços
          </a>
        </div>
      </section>

      {/* Sobre Nós */}
      <section className="mt-12">
        <h2 className="text-3xl font-bold text-white">Sobre Nós</h2>
        <p className="mt-4 text-gray-200 leading-relaxed">
          
        </p>
      </section>

      {/* Slider de DJs */}
      <section className="mt-12">
        <h2 className="text-3xl font-bold text-white mb-4">Conheça Nossos DJs</h2>
        <DJSlider />
      </section>
    </main>
  );
}
