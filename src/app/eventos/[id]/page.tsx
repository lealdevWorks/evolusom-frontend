"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Modal from "react-modal";
import { useSession } from "next-auth/react";
import Picker from "emoji-picker-react"; // Biblioteca para emojis

type Event = {
  _id: string;
  name: string;
  images: string[];
  description: string;
};

type Comment = {
  id: string;
  name: string;
  email: string;
  text: string;
  date: string;
};

export default function Evento() {
  const { id } = useParams();
  const { data: session } = useSession();
  const [event, setEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      const response = await fetch(`http://localhost:5000/api/events/${id}`);
      const data = await response.json();
      setEvent(data);
    };

    fetchEvent();
  }, [id]);

  const openModal = (index: number) => {
    if (event?.images && event.images.length > 0) {
      setCurrentImageIndex(index);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => setIsModalOpen(false);

  const nextImage = () => {
    if (event?.images) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % event.images.length);
    }
  };

  const prevImage = () => {
    if (event?.images) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + event.images.length) % event.images.length);
    }
  };

  const handleAddComment = () => {
    if (!session) {
      alert("Você precisa estar logado para comentar.");
      return;
    }

    if (!newComment.trim()) {
      alert("O comentário não pode estar vazio.");
      return;
    }

    const comment = {
      id: Date.now().toString(),
      name: session.user?.name || "Anônimo",
      email: session.user?.email || "",
      text: newComment.trim(),
      date: new Date().toLocaleString(),
    };

    setComments([...comments, comment]);
    setNewComment("");
  };

  const handleEmojiClick = (event: any, emojiObject: any) => {
    setNewComment(newComment + emojiObject.emoji);
    setEmojiPickerOpen(false);
  };

  if (!event || !event.images || event.images.length === 0) return <div>Carregando...</div>;

  return (
    <main className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-center text-white mb-8">{event.name}</h1>

      {/* Imagens do Evento */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {event.images.map((image, index) => (
          <div key={index} className="cursor-pointer" onClick={() => openModal(index)}>
            <Image src={image} alt={event.name} width={100} height={100} className="object-cover rounded-lg" />
          </div>
        ))}
      </div>

      <p className="text-white text-center mb-6">{event.description}</p>

      {/* Modal para visualização de imagem */}
      <Modal isOpen={isModalOpen} onRequestClose={closeModal} contentLabel="Visualizar Imagem" className="modal-class">
        <button onClick={closeModal} className="absolute top-2 right-2 text-white">X</button>
        {event?.images && event.images.length > 0 && (
          <Image src={event.images[currentImageIndex]} alt={`Imagem ${currentImageIndex + 1}`} width={800} height={600} className="object-contain" />
        )}
        <button onClick={prevImage} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white">❮</button>
        <button onClick={nextImage} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white">❯</button>
      </Modal>

      {/* Comentários */}
      <div className="mt-8">
        <h3 className="text-xl text-white mb-4">Comentários</h3>
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-800 p-4 rounded-lg mb-4">
            <p className="text-white"><strong>{comment.name}</strong> ({comment.date})</p>
            <p className="text-gray-300">{comment.text}</p>
          </div>
        ))}

        <div className="mt-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escreva seu comentário"
            className="w-full p-2 rounded"
          />
          <div className="flex justify-between items-center mt-2">
            <button onClick={() => setEmojiPickerOpen(!emojiPickerOpen)} className="text-white">😊</button>
            {emojiPickerOpen && <Picker onEmojiClick={handleEmojiClick} />}
            <button onClick={handleAddComment} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Comentar</button>
          </div>
        </div>
      </div>
    </main>
  );
}
