// frontend\src\app\eventos\page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import Comments from "./Comments";
import Likes from "./Likes";

// Importação dinâmica do FullscreenViewer para evitar renderização no servidor
const FullscreenViewer = dynamic(() => import("./FullscreenViewer"), { ssr: false });

type Event = {
  _id: string;
  name: string;
  images: string[];
  description: string;
  local: string; // Campo de localização
  date: string;  // Campo de data
};

type Category = {
  _id: string;
  name: string;
  image: string;
  events: Event[];
};

export default function Eventos() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<Event | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [showMore, setShowMore] = useState(false);

  // **Removido:** Estado relacionado à expansão da descrição na listagem de eventos
  // const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

  useEffect(() => {
    const fetchCategoriesWithEvents = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/categories/with-events`);
        if (!response.ok) throw new Error("Erro ao carregar categorias com eventos.");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Erro ao carregar categorias com eventos:", error);
        alert("Não foi possível carregar as categorias com eventos.");
      }
    };

    fetchCategoriesWithEvents();
  }, [API_BASE_URL]);

  const openCategory = (category: Category) => {
    setSelectedCategory(category);
    setSelectedAlbum(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openAlbum = (album: Event) => {
    setSelectedAlbum(album);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    if (selectedAlbum) {
      setSelectedAlbum(null);
    } else {
      setSelectedCategory(null);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openFullscreen = (image: string) => {
    setFullscreenImage(image);
  };

  const closeFullscreen = () => {
    setFullscreenImage(null);
  };

  // **Removido:** Função relacionada à expansão da descrição na listagem de eventos
  /*
  const toggleDescription = (eventId: string) => {
    setExpandedDescriptions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };
  */

  return (
    <main className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-center text-orange-500 mb-8">Nossos Eventos</h1>

      {/* Renderiza as categorias quando nenhuma categoria está selecionada */}
      {!selectedCategory && !selectedAlbum && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center items-center">
          {categories.map((category) => (
            <div
              key={category._id}
              className="flex flex-col items-center cursor-pointer bg-gray-800 p-4 rounded-lg shadow-lg hover:scale-105 transition-transform"
              onClick={() => openCategory(category)}
            >
              <div className="w-40 h-40 rounded-full overflow-hidden shadow-lg mb-4">
                <Image
                  src={category.image}
                  alt={category.name}
                  width={160}
                  height={160}
                  className="object-cover"
                />
              </div>
              <p className="mt-4 text-white font-semibold text-lg">{category.name}</p>
            </div>
          ))}
        </div>
      )}

      {/* Renderiza os eventos da categoria selecionada */}
      {selectedCategory && !selectedAlbum && (
        <div className="mt-10">
          <button
            onClick={goBack}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 mb-6"
          >
            Voltar
          </button>

          <h2 className="text-2xl font-bold text-orange-500 mb-6">
            {selectedCategory.name}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {selectedCategory.events.map((event) => {
              /*
              **Removido:** Verificação e exibição da descrição truncada
              const isExpanded = expandedDescriptions.has(event._id);
              const description = isExpanded
                ? event.description
                : `${event.description.slice(0, 150)}...`;
              */

              return (
                <div
                  key={event._id}
                  className="cursor-pointer bg-gray-800 p-4 rounded-lg shadow-lg hover:scale-105 transition-transform"
                  onClick={() => openAlbum(event)}
                >
                  <div className="w-full h-48 overflow-hidden rounded-lg shadow-md mb-4">
                    {event.images[0] && (
                      <Image
                        src={event.images[0]}
                        alt={event.name}
                        width={256}
                        height={192}
                        className="object-cover"
                      />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white mt-4">{event.name}</h3>
                  {/* **Nova Seção Adicionada**: Exibir Localização e Data */}
                  <p className="text-gray-400 mt-2">
                    📍 {event.local} | 📅 {new Date(event.date).toLocaleDateString()}
                  </p>
                  {/* **Removido:** Descrição truncada e "Leia Mais/Menos" */}
                  {/*
                  <p className="text-gray-300 mt-2">
                    {description}
                    {event.description.length > 150 && (
                      <span
                        className="text-orange-400 cursor-pointer ml-2"
                        onClick={(e) => {
                          e.stopPropagation(); // Evita que o clique abra o álbum
                          toggleDescription(event._id);
                        }}
                      >
                        {isExpanded ? "Menos" : "Leia Mais"}
                      </span>
                    )}
                  </p>
                  */}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Renderiza o álbum selecionado */}
      {selectedAlbum && (
        <div className="mt-10">
          <button
            onClick={goBack}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 mb-6"
          >
            Voltar
          </button>

          <h2 className="text-2xl font-bold text-orange-500 mb-2">
            {selectedAlbum.name}
          </h2>
          <p className="text-gray-400 mb-4">
             📅 {new Date(selectedAlbum.date).toLocaleDateString()}
          </p>

          {/* **Nova Seção Adicionada**: Exibe a descrição do evento */}
          <div className="mb-6">
            <p className="text-gray-300">
              {selectedAlbum.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(showMore ? selectedAlbum.images : selectedAlbum.images.slice(0, 15)).map((image, index) => (
              <div
                key={index}
                className="w-full h-48 overflow-hidden rounded-lg shadow-md cursor-pointer"
                onClick={() => openFullscreen(image)}
              >
                <Image
                  src={image}
                  alt={`Imagem ${index + 1}`}
                  width={256}
                  height={192}
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          {selectedAlbum.images.length > 15 && !showMore && (
            <button
              onClick={() => setShowMore(true)}
              className="bg-orange-500 text-white px-4 py-2 rounded mt-4 hover:bg-orange-600"
            >
              Ver mais
            </button>
          )}

          {fullscreenImage && (
            <FullscreenViewer
              image={fullscreenImage}
              onClose={closeFullscreen}
              images={selectedAlbum.images}
            />
          )}

          {/* **Posicionamento das Seções de Likes e Comments** */}
          <Likes albumId={selectedAlbum._id} API_BASE_URL={API_BASE_URL} />
          <Comments eventId={selectedAlbum._id} />
        </div>
      )}
    </main>
  );
}
