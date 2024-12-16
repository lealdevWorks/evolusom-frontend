"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type Event = {
  _id: string;
  name: string;
  images: string[];
  description: string;
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
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // Fetch categories with events from the backend
  useEffect(() => {
    const fetchCategoriesWithEvents = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/categories-with-events");
        if (!response.ok) throw new Error("Erro ao carregar categorias com eventos.");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Erro ao carregar categorias com eventos:", error);
        alert("Não foi possível carregar as categorias com eventos.");
      }
    };

    fetchCategoriesWithEvents();
  }, []);

  const openCategoryModal = (category: Category) => {
    setSelectedCategory(category);
    document.body.style.overflow = "hidden";
  };

  const closeCategoryModal = () => {
    setSelectedCategory(null);
    document.body.style.overflow = "";
  };

  const openGallery = (images: string[], index: number) => {
    setGalleryImages(images);
    setCurrentImageIndex(index);
    setIsGalleryOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
    document.body.style.overflow = "";
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isGalleryOpen || selectedCategory) {
        switch (event.key) {
          case "Escape":
            if (isGalleryOpen) closeGallery();
            if (selectedCategory) closeCategoryModal();
            break;
          case "ArrowRight":
            if (isGalleryOpen) nextImage();
            break;
          case "ArrowLeft":
            if (isGalleryOpen) prevImage();
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isGalleryOpen, selectedCategory, galleryImages]);

  return (
    <main className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-center text-white mb-8">Nossos Eventos</h1>

      {/* Categorias */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center items-center">
        {categories.map((category) => (
          <div
            key={category._id}
            className="flex flex-col items-center cursor-pointer bg-gray-800 p-4 rounded-lg shadow-lg hover:scale-105 transition-transform"
            onClick={() => openCategoryModal(category)}
          >
            <div className="w-40 h-40 rounded-full overflow-hidden shadow-lg">
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

      {/* Modal para exibir os eventos dentro da categoria */}
      {selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center">
          <button
            onClick={closeCategoryModal}
            className="absolute top-6 right-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 z-50"
          >
            Fechar
          </button>

          <h2 className="text-2xl font-bold text-white mb-6">{selectedCategory.name}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto p-4 justify-center">
            {selectedCategory.events.map((event) => (
              <div key={event._id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
                <div className="w-32 h-24 overflow-hidden rounded-lg shadow-md">
                  <Image
                    src={event.images[0]}
                    alt={event.name}
                    width={128}
                    height={96}
                    className="object-cover cursor-pointer"
                    onClick={() => openGallery(event.images, 0)}
                  />
                </div>
                <h3 className="text-xl font-bold text-white mt-4">{event.name}</h3>
                <p className="text-gray-300 mt-2">{event.description.slice(0, 100)}...</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal da Galeria */}
      {isGalleryOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <button
            onClick={closeGallery}
            className="absolute top-6 right-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 z-50"
          >
            Fechar
          </button>
          <div className="relative w-[90vw] h-[90vh] flex items-center justify-center">
            <Image
              src={galleryImages[currentImageIndex]}
              alt={`Imagem ${currentImageIndex + 1}`}
              layout="fill"
              objectFit="contain"
              className="rounded-lg"
            />
          </div>
          <button
            onClick={prevImage}
            className="absolute left-6 bg-gray-700 text-white px-3 py-2 rounded-full hover:bg-gray-800 z-50"
          >
            &#8249;
          </button>
          <button
            onClick={nextImage}
            className="absolute right-6 bg-gray-700 text-white px-3 py-2 rounded-full hover:bg-gray-800 z-50"
          >
            &#8250;
          </button>
        </div>
      )}
    </main>
  );
}
