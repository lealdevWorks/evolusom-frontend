"use client";

import { useEffect, useState } from "react";
import API_BASE_URL from "../../config/api";
import Image from "next/image"; // Importa o componente Image
import Toast from "../../components/Toast"; // Importa o componente Toast

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
  const [loading, setLoading] = useState(false);

  // Estado para gerenciar os toasts
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const isFormValid = Object.values(formData).every((field) => field.trim() !== "");

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

  const handleRemoveItem = (id: string) => {
    const updatedCart = cart.filter((item) => item._id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setToast({ message: "Item removido do carrinho.", type: "info" });
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      setToast({ message: "O carrinho está vazio!", type: "error" });
      return;
    }
    setShowForm(true);
    // Rolagem para o topo
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [fallbackImages, setFallbackImages] = useState<{ [key: string]: boolean }>({});

  const handleImageError = (id: string) => {
    setFallbackImages((prev) => ({ ...prev, [id]: true }));
  };

  // Função para formatar a data para dd/mm/aaaa
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Os meses começam do 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const saveOrderToBackend = async (): Promise<boolean> => {
    const formattedDate = formatDate(formData.data);
    const orderData = {
      nome: formData.nome,
      evento: formData.evento,
      data: formattedDate,
      cidade: formData.cidade,
      local: formData.local,
      tipo: formData.tipo,
      itens: cart.map((item) => ({
        _id: item._id,
        name: item.name,
        description: item.description || "Sem descrição",
        coverImage: `${API_BASE_URL}/services/image/${item._id}/coverImage`,
      })),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorDetails = await response.json().catch(() => ({}));
        throw new Error(errorDetails.error || "Erro ao salvar o pedido no backend.");
      }

      setToast({ message: "Pedido salvo com sucesso!", type: "success" });
      return true;
    } catch (error) {
      console.error("Erro ao salvar pedido:", error);
      setToast({ message: "Erro ao salvar o pedido. Tente novamente.", type: "error" });
      return false;
    }
  };

  const handleSendWhatsApp = async () => {
    setLoading(true);
    const success = await saveOrderToBackend();
    if (!success) {
      setLoading(false);
      return;
    }

    const itens = cart.map((item) => `• ${item.name}`).join("%0A");

    const detalhesEvento = `👉 Nome do Solicitante: ${formData.nome || "Não informado"}%0A` +
      `👉 Evento: ${formData.evento || "Não informado"}%0A` +
      `👉 Data: ${formData.data ? formatDate(formData.data) : "Não informada"}%0A` +
      `👉 Cidade: ${formData.cidade || "Não informada"}%0A` +
      `👉 Salão ou Local: ${formData.local || "Não informado"}%0A` +
      `👉 Tipo de Evento: ${formData.tipo || "Não informado"}`;

    const whatsappLink = `https://api.whatsapp.com/send/?phone=+5551999068850&text=Ol%C3%A1%21+Gostaria+de+um+or%C3%A7amento+para+os+seguintes+servi%C3%A7os%3A%0A${itens}%0A%0A*Detalhes do Evento*:%0A${detalhesEvento}&type=phone_number&app_absent=0`;

    window.open(whatsappLink, "_blank");

    // Limpar o carrinho e o formulário
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
    setToast({ message: "Pedido enviado com sucesso!", type: "success" });
    setLoading(false);

    // Rolagem para o topo após o envio
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-20 py-10">
      {/* Renderização do Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <h1 className="text-3xl font-bold text-white mb-6">Carrinho</h1>

      {loading ? (
        <p className="text-center text-gray-300">Processando, aguarde...</p>
      ) : cart.length === 0 ? (
        <p className="text-gray-300">Seu carrinho está vazio.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cart.map((item) => {
            const imageUrl = `${API_BASE_URL}/services/image/${item._id}/coverImage`;
            return (
              <div
                key={item._id}
                className="bg-gray-900 text-gray-300 rounded-lg shadow-lg p-4 flex flex-col justify-between overflow-hidden"
              >
                <div className="relative h-32 sm:h-40 lg:h-48 w-full rounded-lg mb-4">
                  <Image
                    src={fallbackImages[`service-${item._id}`] ? "/default-image.jpg" : imageUrl}
                    alt={item.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                    onError={() => handleImageError(`service-${item._id}`)}
                  />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white truncate">{item.name}</h2>
                <button
                  onClick={() => handleRemoveItem(item._id)}
                  className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Remover
                </button>
              </div>
            );
          })}
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
          {Object.entries(formData).map(([key, value]) => (
            <div className="mb-4" key={key}>
              <label
                htmlFor={key}
                className="block text-sm font-bold mb-2"
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              {key === "data" ? (
                <input
                  id={key}
                  name={key}
                  type="date"
                  value={value}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-800 text-white rounded-lg"
                />
              ) : (
                <input
                  id={key}
                  name={key}
                  value={value}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-800 text-white rounded-lg"
                />
              )}
            </div>
          ))}
          <button
            onClick={handleSendWhatsApp}
            disabled={loading || !isFormValid}
            className={`mt-6 ${loading || !isFormValid ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'} text-white py-2 px-4 rounded-lg transition-colors`}
          >
            {loading ? "Enviando..." : "Enviar Detalhes no WhatsApp"}
          </button>
        </div>
      )}
    </main>
  );
};

export default CarrinhoPage;
