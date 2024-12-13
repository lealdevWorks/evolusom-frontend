"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Service = {
  _id: string;
  name: string;
  description: string;
  coverImage: string;
  additionalImages: string[];
};

export default function Servicos() {
  const [services, setServices] = useState<Service[]>([]);
  const [expandedDescriptions, setExpandedDescriptions] = useState<{ [key: string]: boolean }>({});
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: string]: number }>({});
  const [hoveredServiceId, setHoveredServiceId] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/services")
      .then((response) => {
        if (!response.ok) throw new Error("Erro ao buscar serviços.");
        return response.json();
      })
      .then((data) => setServices(data))
      .catch((error) => console.error("Erro ao carregar serviços:", error));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => {
        const updated = { ...prev };
        services.forEach((service) => {
          const images = [service.coverImage, ...service.additionalImages];
          if (images.length > 1 && hoveredServiceId === service._id) {
            updated[service._id] = ((prev[service._id] || 0) + 1) % images.length;
          }
        });
        return updated;
      });
    }, 3000); // Tempo do carrossel: 4 segundos por imagem

    return () => clearInterval(interval);
  }, [services, hoveredServiceId]);

  const toggleDescription = (id: string) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-20 py-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-white text-center">Nossos Serviços</h1>
      <p className="mt-4 text-gray-300 text-center max-w-3xl mx-auto">
        Descubra nossos serviços de sonorização, iluminação e DJs profissionais para transformar seu evento em uma experiência inesquecível.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
        {services.map((service) => {
          const images = [service.coverImage, ...service.additionalImages];
          return (
            <div
              key={service._id}
              className="bg-gray-900 text-gray-300 shadow-lg rounded-lg overflow-hidden hover:scale-105 hover:shadow-xl transition-transform"
              onMouseEnter={() => setHoveredServiceId(service._id)}
              onMouseLeave={() => setHoveredServiceId(null)}
            >
              <Link href={`/servicos/${service._id}`} passHref>
                <div className="relative cursor-pointer" aria-label={`Abrir galeria do serviço ${service.name}`}>
                  <img
                    src={images[currentImageIndex[service._id] || 0]}
                    alt={service.name}
                    className={`w-full h-48 object-cover ${
                      images.length > 1 ? "transition-opacity duration-700 ease-in-out" : ""
                    }`}
                  />
                </div>
              </Link>
              <div className="p-6">
                <h2 className="text-xl font-bold text-white">{service.name}</h2>
                <p className="mt-4">
                  {expandedDescriptions[service._id]
                    ? service.description
                    : `${service.description.slice(0, 100)}...`}
                </p>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleDescription(service._id);
                  }}
                  className="mt-2 text-orange-500 hover:text-orange-600 focus:outline-none"
                >
                  {expandedDescriptions[service._id] ? "Ler menos" : "Ler mais"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
