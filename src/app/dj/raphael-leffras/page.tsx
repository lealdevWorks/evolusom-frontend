import { FaInstagram, FaFacebook } from "react-icons/fa"; // Importa os ícones das redes sociais

export default function RaphaelLeffras() {
  return (
    <main className="container mx-auto px-6 py-10">
      {/* Título com Imagem */}
      <header className="flex flex-col md:flex-row items-center gap-6 mb-8">
        {/* Imagem do DJ */}
        <div className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-gray-700 overflow-hidden shadow-md">
          <img
            src="/img/dj-raphael-leffras.jpg" // Substitua pelo caminho correto da imagem
            alt="DJ Raphael Leffras"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Título */}
        <h1 className="text-4xl font-extrabold text-white text-center md:text-left">
          DJ Raphael Leffras
        </h1>
      </header>

      {/* Seção de Apresentação */}
      <section className="bg-gray-900 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-orange-500 mb-4">
          Um Pouco Sobre Mim
        </h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          Meu nome é <strong>Rafael Leal</strong>, nascido em <strong>10 de janeiro de 1994</strong>, 
          e minha conexão com a música e os eventos vai além de um simples trabalho, é uma verdadeira paixão.
          Desde pequeno, eu adorava ficar perto do palco e das caixas de som, fascinado pelo poder que a música 
          tem de transformar momentos comuns em experiências inesquecíveis.
        </p>
        <p className="text-gray-300 leading-relaxed mb-4">
          Essa curiosidade me levou a enxergar a música como uma forma de conexão e alegria. Aos 16 anos, 
          tive a honra de ser convidado pelo talentoso e inesquecível DJ Jholl (<strong>Josoe Vargas</strong>) 
          para fazer parte de seu projeto de sonorização. Comecei nos bastidores, carregando caixas de som 
          e ajudando na organização, mas sempre observando cada detalhe, com os olhos brilhando de entusiasmo.
        </p>
        <p className="text-gray-300 leading-relaxed mb-4">
          O DJ Jholl foi muito mais do que um profissional talentoso; ele foi uma inspiração para todos que 
          tiveram o privilégio de trabalhar ao seu lado. Sua paixão pela música era contagiante, e sua generosidade 
          em compartilhar conhecimento deixou um impacto duradouro em todos que o conheceram, especialmente em mim. 
          Com ele, aprendi a essência da sonorização e descobri que meu caminho era animar eventos, conectando o público 
          e criando momentos inesquecíveis através da música.
        </p>
        <p className="text-gray-300 leading-relaxed mb-4">
          Hoje, cada evento que realizo carrega um pouco dos ensinamentos que aprendi com ele e do exemplo que ele deixou. 
          Seu legado permanece vivo não apenas nas lembranças, mas também na energia que a música proporciona, levando alegria 
          e emoção às pessoas. Esta homenagem é uma forma de reconhecer tudo o que ele fez e de manter viva sua contribuição 
          para a arte e para a vida.
        </p>
        <p className="text-gray-300 leading-relaxed mb-4">
          Atualmente, como integrante do projeto <strong className="text-orange-500">Evolusom</strong>, conto com a parceria 
          de profissionais incríveis, como o talentoso <strong>DJ Matheus</strong> (<strong>Matheus Mengue</strong>), que compartilha 
          da mesma paixão e compromisso com a música. Juntos, buscamos elevar cada evento ao máximo, proporcionando experiências 
          únicas e inesquecíveis para o público.
        </p>
        <p className="text-gray-300 leading-relaxed">
          Transformo cada celebração em um momento especial, utilizando toda a bagagem e entusiasmo que trago comigo. Meu compromisso 
          é dar o melhor de mim, honrando as pessoas que fizeram parte da minha trajetória e levando felicidade por onde passo. 
          Afinal, a música é a alma dos momentos especiais, e eu tenho o privilégio de ajudar a torná-los ainda mais marcantes.
        </p>
      </section>

      {/* Redes Sociais */}
      <section className="mt-10 text-center">
        <h2 className="text-2xl font-bold text-orange-500 mb-4">
          Conecte-se Comigo
        </h2>
        <div className="flex justify-center gap-6">
          <a
            href="https://www.instagram.com/djraphaelleffras/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-orange-500 transition-colors"
          >
            <FaInstagram className="text-4xl" />
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=61569863943384&locale=pt_BR"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-orange-500 transition-colors"
          >
            <FaFacebook className="text-4xl" />
          </a>
        </div>
      </section>

      {/* Citação ou Destaque */}
      <section className="mt-10 text-center">
        <blockquote className="text-xl italic text-gray-400 font-semibold">
          “A música é a alma dos momentos especiais, e eu tenho o privilégio de ajudar a torná-los ainda mais marcantes.”
        </blockquote>
      </section>
    </main>
  );
}
