"use client";

import { useEffect, useState } from "react";
import API_BASE_URL from "../config/api";

type Service = {
  _id: string;
  name: string;
  description?: string;
  coverImage: string;
};

const CarrinhoPage = () => {
  const [cart, setCart] = useState<Service[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    evento: "",
    data: "",
    cidade: "",
    local: "",
    tipo: "",
  });

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("O carrinho está vazio!");
      return;
    }
    setShowForm(true);
  };

  const saveOrderToBackend = async (): Promise<boolean> => {
    const orderData = {
      nome: formData.nome,
      evento: formData.evento,
      data: formData.data,
      cidade: formData.cidade,
      local: formData.local,
      tipo: formData.tipo,
      itens: cart.map((item) => ({
        _id: item._id,
        name: item.name,
        description: item.description || "Sem descrição",
        coverImage: item.coverImage,
      })),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        console.error("Erro do backend:", errorDetails);
        throw new Error("Erro ao salvar o pedido no backend.");
      }

      alert("Pedido salvo com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro ao salvar pedido:", error);
      alert("Erro ao salvar o pedido. Tente novamente.");
      return false;
    }
  };

  const handleSendWhatsApp = async () => {
    const success = await saveOrderToBackend();
    if (!success) return;

    const itens = cart
      .map((item) => `• ${item.name} - ${item.description || "Sem descrição"}`)
      .join("%0A");

    const detalhesEvento = `👉 Nome do Solicitante: ${formData.nome || "Não informado"}
👉 Evento: ${formData.evento || "Não informado"}
👉 Data: ${formData.data || "Não informada"}
👉 Cidade: ${formData.cidade || "Não informada"}
👉 Salão ou Local: ${formData.local || "Não informado"}
👉 Tipo de Evento: ${formData.tipo || "Não informado"}`.replace(/\n/g, "%0A");

    const whatsappLink = `https://api.whatsapp.com/send/?phone=+5551999068850&text=Ol%C3%A1%21+Gostaria+de+um+or%C3%A7amento+para+os+seguintes+servi%C3%A7os%3A%0A${itens}%0A%0A*Detalhes do Evento*:%0A${detalhesEvento}&type=phone_number&app_absent=0`;

    window.open(whatsappLink, "_blank");

    setFormData({
      nome: "",
      evento: "",
      data: "",
      cidade: "",
      local: "",
      tipo: "",
    });
    setCart([]);
    localStorage.removeItem("cart");
    setShowForm(false);
  };

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-20 py-10">
      <h1 className="text-3xl font-bold text-white mb-6">Carrinho</h1>

      {cart.length === 0 ? (
        <p className="text-gray-300">Seu carrinho está vazio.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cart.map((item) => (
            <div
              key={item._id}
              className="bg-gray-900 text-gray-300 rounded-lg shadow-lg p-4 flex flex-col justify-between"
            >
              <img
                src={item.coverImage}
                alt={item.name}
                className="w-full h-32 sm:h-40 lg:h-48 object-cover rounded-lg mb-4"
              />
              <h2 className="text-lg sm:text-xl font-bold text-white">{item.name}</h2>
              <p className="text-sm text-gray-400 mb-2">{item.description || "Sem descrição"}</p>
            </div>
          ))}
        </div>
      )}

      {cart.length > 0 && (
        <div className="mt-4">
          {!showForm && (
            <button
              onClick={handleCheckout}
              className="mt-4 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Finalizar Pedido
            </button>
          )}
        </div>
      )}

      {showForm && (
        <div className="mt-6 bg-gray-900 text-gray-300 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-white mb-4">Detalhes do Orçamento</h2>
          <div className="mb-4">
            <label htmlFor="nome" className="block text-sm font-bold mb-2">Nome</label>
            <input
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              className="w-full p-3 bg-gray-800 text-white rounded-lg"
              placeholder="Ex: João da Silva"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="evento" className="block text-sm font-bold mb-2">Evento</label>
            <textarea
              id="evento"
              name="evento"
              value={formData.evento}
              onChange={handleInputChange}
              className="w-full p-3 bg-gray-800 text-white rounded-lg"
              placeholder="Ex: Um casamento ao ar livre..."
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="data" className="block text-sm font-bold mb-2">Data</label>
            <input
              type="date"
              id="data"
              name="data"
              value={formData.data}
              onChange={handleInputChange}
              className="w-full p-3 bg-gray-800 text-white rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="cidade" className="block text-sm font-bold mb-2">Cidade</label>
            <input
              id="cidade"
              name="cidade"
              value={formData.cidade}
              onChange={handleInputChange}
              className="w-full p-3 bg-gray-800 text-white rounded-lg"
              placeholder="Ex: São Paulo"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="local" className="block text-sm font-bold mb-2">Salão ou Local</label>
            <input
              id="local"
              name="local"
              value={formData.local}
              onChange={handleInputChange}
              className="w-full p-3 bg-gray-800 text-white rounded-lg"
              placeholder="Ex: Salão XYZ"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="tipo" className="block text-sm font-bold mb-2">Tipo de Evento</label>
            <input
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleInputChange}
              className="w-full p-3 bg-gray-800 text-white rounded-lg"
              placeholder="Ex: Casamento"
            />
          </div>
          <button
            onClick={handleSendWhatsApp}
            className="mt-6 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
          >
            Enviar Detalhes no WhatsApp
          </button>
        </div>
      )}
    </main>
  );
};

export default CarrinhoPage;
