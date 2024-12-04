'use client';

import { useState, useEffect } from 'react';

type Service = {
  id: number;
  name: string;
  description: string;
  coverImage: string;
  additionalImages: string[];
};

const AdminServicos = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [newService, setNewService] = useState<Service>({
    id: 0,
    name: '',
    description: '',
    coverImage: '',
    additionalImages: [],
  });

  // Carregar serviços do LocalStorage ao iniciar
  useEffect(() => {
    const savedServices = localStorage.getItem('services');
    if (savedServices) {
      setServices(JSON.parse(savedServices));
    }
  }, []);

  // Salvar serviços no LocalStorage sempre que mudarem
  useEffect(() => {
    localStorage.setItem('services', JSON.stringify(services));
  }, [services]);

  const addService = () => {
    if (newService.name && newService.description && newService.coverImage) {
      setServices((prev) => [
        ...prev,
        { ...newService, id: Date.now(), additionalImages: [] },
      ]);
      setNewService({ id: 0, name: '', description: '', coverImage: '', additionalImages: [] });
    }
  };

  const deleteService = (id: number) => {
    setServices((prev) => prev.filter((service) => service.id !== id));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewService((prev) => ({ ...prev, coverImage: imageUrl }));
    }
  };

  return (
    <main className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-white mb-6">Gerenciar Serviços</h1>

      {/* Formulário de Adição */}
      <div className="mb-6 bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-white mb-4">Adicionar Novo Serviço</h2>
        <input
          type="text"
          className="w-full p-3 rounded-lg bg-gray-700 text-white mb-4"
          placeholder="Nome do Serviço"
          value={newService.name}
          onChange={(e) => setNewService({ ...newService, name: e.target.value })}
        />
        <textarea
          className="w-full p-3 rounded-lg bg-gray-700 text-white mb-4"
          placeholder="Descrição"
          value={newService.description}
          onChange={(e) => setNewService({ ...newService, description: e.target.value })}
        ></textarea>
        <input
          type="file"
          className="w-full p-3 text-white mb-4"
          accept="image/*"
          onChange={handleFileUpload}
        />
        <button
          onClick={addService}
          className="w-full bg-orange-500 py-2 px-4 rounded-lg hover:bg-orange-600"
        >
          Adicionar Serviço
        </button>
      </div>

      {/* Lista de Serviços */}
      <ul className="space-y-4">
        {services.map((service) => (
          <li
            key={service.id}
            className="bg-gray-800 p-6 rounded-lg shadow-lg text-white flex justify-between items-center"
          >
            <div>
              <h3 className="text-lg font-bold">{service.name}</h3>
              <p className="text-sm text-gray-300">{service.description}</p>
            </div>
            <button
              onClick={() => deleteService(service.id)}
              className="text-red-500 hover:text-red-600"
            >
              Excluir
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default AdminServicos;
