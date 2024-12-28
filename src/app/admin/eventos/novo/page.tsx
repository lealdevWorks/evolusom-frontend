"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image"; // Importação do componente Image

// Type Definitions
type Category = {
  _id: string;
  name: string;
};

type EventType = {
  _id: string;
  name: string;
  category: {
    _id: string;
    name: string;
  };
  description: string;
  local?: string;
  images: string[];
  date: string;
};

const emojiList = [
  "🎉", "♫", "📸", "✨", "💃", "🕺", "🥂", "🎂",
  "🚀", "🏆", "🌟", "🎈", "🪩", "💡", "📍", "🔊", "💍"
];

const MAX_FILES = 25;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function GerenciarEventos() {
  // State Variables
  const [event, setEvent] = useState<{
    name: string;
    category: string;
    description: string;
    local: string;
    date: string;
    images: string[];
  }>({
    name: "",
    category: "",
    description: "",
    local: "",
    date: "",
    images: [],
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);
  const [events, setEvents] = useState<EventType[]>([]);
  const router = useRouter();

  // Fetch Categories
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

  // Fetch Events
  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/events");
      if (!response.ok) throw new Error("Erro ao carregar eventos.");
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
      alert("Não foi possível carregar os eventos.");
    }
  };

  // useEffect to fetch data on component mount
  useEffect(() => {
    fetchCategories();
    fetchEvents();
  }, []);

  // Handle Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files;
    if (files) {
      if (event.images.length + files.length > MAX_FILES) {
        alert(`Você excedeu o limite de ${MAX_FILES} arquivos. Por favor, selecione menos arquivos.`);
        return;
      }

      Array.from(files).forEach((file) => {
        if (file.size > MAX_FILE_SIZE) {
          alert(`O arquivo ${file.name} excede o tamanho máximo de 5MB e não será adicionado.`);
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result && typeof reader.result === "string") {
            setImagePreviews((prev) => [...prev, reader.result as string]);
            setEvent((prev) => ({
              ...prev,
              images: [...prev.images, reader.result as string],
            }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Add Emoji to Description
  const addEmojiToDescription = (emoji: string): void => {
    setEvent((prev) => ({ ...prev, description: prev.description + emoji }));
  };

  // Remove Image
  const removeImage = (index: number): void => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setEvent((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Handle Save Event
  const handleSaveEvent = async (): Promise<void> => {
    if (!event.name || !event.category || !event.description || !event.date || event.images.length === 0) {
      alert("Preencha todos os campos e adicione pelo menos uma imagem ou vídeo.");
      return;
    }

    const eventDate = new Date(event.date);
    if (isNaN(eventDate.getTime())) {
      alert("Por favor, insira uma data válida para o evento.");
      return;
    }

    try {
      const fullDescription = `${event.description}\n📍 Local: ${event.local}`;
      const response = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...event, description: fullDescription, date: eventDate }),
      });

      const result = await response.json().catch(() => null);
      console.log("Resultado do backend:", result);

      if (!response.ok) throw new Error("Erro ao salvar evento.");

      alert("Evento salvo com sucesso!");
      setEvent({
        name: "",
        category: "",
        description: "",
        local: "",
        date: "",
        images: [],
      });
      setImagePreviews([]);
      fetchEvents();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar evento.");
    }
  };

  // Handle Delete Event
  const handleDeleteEvent = async (id: string): Promise<void> => {
    if (!confirm("Tem certeza que deseja excluir este evento?")) return;
    try {
      const response = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Erro ao excluir evento.");
      alert("Evento excluído com sucesso!");
      fetchEvents();
    } catch (error) {
      console.error("Erro ao excluir evento:", error);
      alert("Não foi possível excluir o evento.");
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">Gerenciar Eventos</h1>
      
      {/* Formulário para adicionar novo evento */}
      <div className="bg-gray-800 p-6 rounded-lg text-white max-w-4xl mx-auto shadow-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">Adicionar Novo Evento</h2>
        
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

        {/* Campo de Data do Evento Adicionado */}
        <input
          type="date"
          placeholder="Data do Evento"
          value={event.date}
          onChange={(e) => setEvent({ ...event, date: e.target.value })}
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
          accept="image/*,video/*"
          onChange={handleImageUpload}
          className="w-full p-2 mb-4 bg-gray-700 text-white"
        />

        <div className="flex flex-wrap gap-4 mb-4 relative">
          {imagePreviews.map((image, index) => (
            <div key={index} className="relative inline-block">
              <Image
                src={image}
                alt="Pré-visualização"
                width={128} // Correspondente a w-32 (32 * 4 = 128px)
                height={128} // Correspondente a h-32
                className="object-cover rounded-lg shadow-md"
                unoptimized // Desativa a otimização para data URLs
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                title="Remover imagem"
              >
                X
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleSaveEvent}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg text-lg transition-transform transform hover:scale-105"
        >
          Salvar Evento
        </button>
      </div>

      {/* Lista de eventos existentes */}
      <div className="bg-gray-800 p-6 rounded-lg text-white max-w-4xl mx-auto shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Eventos Cadastrados</h2>
        
        {events.length === 0 ? (
          <p className="text-center">Nenhum evento cadastrado.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr><th className="px-4 py-2">Nome</th><th className="px-4 py-2">Categoria</th><th className="px-4 py-2">Data</th><th className="px-4 py-2">Ações</th></tr>
            </thead>
            <tbody>
              {events.map((ev: EventType) => (
                <tr key={ev._id}>
                  <td className="border-b border-gray-700 px-4 py-2">{ev.name}</td>
                  <td className="border-b border-gray-700 px-4 py-2">{ev.category.name}</td>
                  <td className="border-b border-gray-700 px-4 py-2">{new Date(ev.date).toLocaleDateString()}</td>
                  <td className="border-b border-gray-700 px-4 py-2">
                    <button
                      onClick={() => handleDeleteEvent(ev._id)}
                      className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-lg text-sm"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
