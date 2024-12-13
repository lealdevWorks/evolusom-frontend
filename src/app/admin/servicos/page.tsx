"use client";

import { useState, useEffect } from "react";

type Service = {
  _id: string;
  name: string;
  description: string;
  coverImage: string;
  additionalImages: string[];
};

const AdminServicos = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [newService, setNewService] = useState<Omit<Service, "_id">>({
    name: "",
    description: "",
    coverImage: "",
    additionalImages: [],
  });
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Carregar serviços do backend
  useEffect(() => {
    fetch("http://localhost:5000/api/services")
      .then((response) => response.json())
      .then((data) => setServices(data))
      .catch((error) => console.error("Erro ao carregar serviços:", error));
  }, []);

  // Adicionar novo serviço
  const handleAddService = async () => {
    if (!newService.name || !newService.description || imagePreviews.length === 0) {
      alert("Preencha todos os campos e envie pelo menos uma imagem.");
      return;
    }

    try {
      const payload = {
        ...newService,
        coverImage: imagePreviews[0], // Primeira imagem é usada como cover
        additionalImages: imagePreviews.slice(1), // Outras imagens como adicionais
      };

      const response = await fetch("http://localhost:5000/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Erro ao adicionar serviço.");

      const createdService = await response.json();
      setServices((prev) => [...prev, createdService]);

      // Limpa os campos após o envio
      setNewService({ name: "", description: "", coverImage: "", additionalImages: [] });
      setImagePreviews([]);

      alert("Serviço adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar serviço:", error);
      alert("Erro ao adicionar serviço.");
    }
  };

  // Deletar serviço
  const handleDeleteService = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/services/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro ao remover serviço.");

      setServices((prev) => prev.filter((service) => service._id !== id));

      alert("Serviço removido com sucesso!");
    } catch (error) {
      console.error("Erro ao remover serviço:", error);
      alert("Erro ao remover serviço.");
    }
  };

  // Upload de imagens
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  return (
    <main className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-white mb-6">Gerenciar Serviços</h1>
      <div className="mb-6 bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-4">Adicionar Serviço</h2>
        {imagePreviews.length > 0 && (
          <div className="flex space-x-4 mb-4">
            {imagePreviews.map((image, index) => (
              <img
                key={index}
                src={image}
                alt="Pré-visualização"
                className="h-24 w-24 object-cover rounded-lg shadow-md"
              />
            ))}
          </div>
        )}
        <input
          type="text"
          placeholder="Nome do Serviço"
          value={newService.name}
          onChange={(e) => setNewService({ ...newService, name: e.target.value })}
          className="w-full p-3 mb-4 bg-gray-700 text-white rounded-lg"
        />
        <textarea
          placeholder="Descrição"
          value={newService.description}
          onChange={(e) => setNewService({ ...newService, description: e.target.value })}
          className="w-full p-3 mb-4 bg-gray-700 text-white rounded-lg"
        ></textarea>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="w-full p-3 mb-4 text-white"
        />
        <button
          onClick={handleAddService}
          className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600"
        >
          Adicionar Serviço
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service._id}
            className="bg-gray-800 text-white p-6 rounded-lg shadow-lg"
          >
            <img
              src={service.coverImage || "/img/default-service.png"}
              alt={service.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-lg font-bold">{service.name}</h3>
            <button
              onClick={() => handleDeleteService(service._id)}
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 w-full"
            >
              Remover
            </button>
          </div>
        ))}
      </div>
    </main>
  );
};

export default AdminServicos;
