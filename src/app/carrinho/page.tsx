"use client";

import { useEffect, useState } from "react";

type Service = {
  _id: string;
  name: string;
  description: string;
  coverImage: string;
};

const CarrinhoPage = () => {
  const [cart, setCart] = useState<Service[]>([]);

  // Carregar itens do carrinho do LocalStorage ao montar o componente
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Remover item do carrinho
  const removeFromCart = (id: string) => {
    const updatedCart = cart.filter((item) => item._id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // Atualiza o LocalStorage
  };

  // Enviar orçamento via WhatsApp
  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("O carrinho está vazio!");
      return;
    }

    const message = cart
      .map((item) => `• ${item.name}`) // Apenas o nome dos itens
      .join("%0A"); // %0A adiciona quebras de linha para mensagens no WhatsApp

    const whatsappLink = `https://api.whatsapp.com/send/?phone=+5551999068850&text=Ol%C3%A1%21+Gostaria+de+um+or%C3%A7amento+para+os+seguintes+servi%C3%A7os%3A%0A${message}&type=phone_number&app_absent=0`;
    window.open(whatsappLink, "_blank");
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
                className="w-full h-32 object-cover rounded-lg mb-4"
              />
              <h2 className="text-lg font-bold text-white">{item.name}</h2>
              <button
                onClick={() => removeFromCart(item._id)}
                className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
              >
                Remover
              </button>
            </div>
          ))}
        </div>
      )}

      {cart.length > 0 && (
        <button
          onClick={handleCheckout}
          className="mt-6 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Finalizar Pedido
        </button>
      )}
    </main>
  );
};

export default CarrinhoPage;
