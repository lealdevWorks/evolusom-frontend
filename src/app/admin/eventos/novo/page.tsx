"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type Category = {
  _id: string;
  name: string;
};

const emojiList = [
  "🎉", " ♫", "📸", "✨", "💃", "🕺", "🥂", "🎂",
  "🚀", "🏆", "🌟", "🎈", "🪩", "💡", "📍","🔊","💍"
];

export default function NovoEvento() {
  const [event, setEvent] = useState({
    name: "",
    category: "",
    description: "",
    local: "",
    images: [] as string[],
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/categories");
        if (!response.ok) throw new Error("Erro ao carregar categorias.");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
        alert("Não foi possível carregar as categorias.");
      }
    };

    fetchCategories();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews((prev) => [...prev, reader.result as string]);
          setEvent((prev) => ({
            ...prev,
            images: [...prev.images, reader.result as string],
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const addEmojiToDescription = (emoji: string) => {
    setEvent((prev) => ({ ...prev, description: prev.description + emoji }));
  };

  const handleSaveEvent = async () => {
    if (!event.name || !event.category || !event.description || event.images.length === 0) {
      alert("Preencha todos os campos e adicione pelo menos uma imagem.");
      return;
    }

    try {
      const fullDescription = `${event.description}\n📍 Local: ${event.local}`;
      const response = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...event, description: fullDescription }),
      });

      if (!response.ok) throw new Error("Erro ao salvar evento.");

      alert("Evento salvo com sucesso!");
      router.push("/admin/dashboard");
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar evento.");
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">Adicionar Novo Evento</h1>

      <div className="bg-gray-800 p-6 rounded-lg text-white max-w-4xl mx-auto shadow-lg">
        <input
          type="text"
          placeholder="Nome do Evento"
          value={event.name}
          onChange={(e) => setEvent({ ...event, name: e.target.value })}
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
        />

        <select
          value={event.category}
          onChange={(e) => setEvent({ ...event, category: e.target.value })}
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
        >
          <option value="">Selecione uma Categoria</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Local do Evento"
          value={event.local}
          onChange={(e) => setEvent({ ...event, local: e.target.value })}
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
        />

        <textarea
          placeholder="Descrição do Evento"
          value={event.description}
          onChange={(e) => setEvent({ ...event, description: e.target.value })}
          ref={descriptionRef}
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white h-32"
        ></textarea>

        <div className="flex flex-wrap gap-2 mb-4">
          {emojiList.map((emoji) => (
            <button
              key={emoji}
              draggable
              onDragStart={(e) => e.dataTransfer.setData("text/plain", emoji)}
              onClick={() => addEmojiToDescription(emoji)}
              className="bg-gray-600 text-white p-2 rounded-lg hover:bg-gray-500 shadow-md"
            >
              {emoji}
            </button>
          ))}
        </div>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full p-2 mb-4 bg-gray-700 text-white"
        />

        <div className="flex flex-wrap gap-4 mb-4">
          {imagePreviews.map((image, index) => (
            <img
              key={index}
              src={image}
              alt="Pré-visualização"
              className="w-32 h-32 object-cover rounded-lg shadow-md"
            />
          ))}
        </div>

        <button
          onClick={handleSaveEvent}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg text-lg transition-transform transform hover:scale-105"
        >
          Salvar Evento
        </button>
      </div>
    </div>
  );
}
