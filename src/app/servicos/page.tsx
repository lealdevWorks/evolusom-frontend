'use client';

import { useState, useEffect } from 'react';

// Tipo do serviço
type Service = {
  id: number;
  name: string;
  description: string;
  coverImage: string;
  additionalImages: string[];
};

export default function Servicos() {
  const [services, setServices] = useState<Service[]>([]); // Tipo definido para o estado

  // Carregar serviços do LocalStorage
  useEffect(() => {
    const savedServices = localStorage.getItem('services');
    if (savedServices) {
      setServices(JSON.parse(savedServices) as Service[]); // Tipando os dados recuperados
    }
  }, []);

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
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-gray-900 text-gray-300 shadow-lg rounded-lg overflow-hidden hover:scale-105 hover:shadow-xl transition-transform"
          >
            <img
              src={service.coverImage} // Acessando o campo `coverImage`
              alt={service.name} // Acessando o campo `name`
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h2 className="text-xl font-bold text-white">{service.name}</h2>
              <p className="mt-4">{service.description}</p> {/* Acessando o campo `description` */}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
