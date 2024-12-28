"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import Image from "next/image"; 
import Toast from "../../components/Toast"; 

type Like = {
  user: string;
  emoji: string;
  timestamp: string;
};

interface LikesProps {
  albumId: string;
  API_BASE_URL: string;
}

// Emojis de reação para festas com coração e curtir com a mão
const emojiOptions = [
  { emoji: "👍", label: "Curtir" },
  { emoji: "❤️", label: "Amei" },
  { emoji: "🎉", label: "Comemorar" },
  { emoji: "🥳", label: "Festa" },
  { emoji: "😄", label: "Felicidade" },
  { emoji: "💃", label: "Dança" },
  { emoji: "🍹", label: "Brinde" },
];

const Likes: React.FC<LikesProps> = ({ albumId, API_BASE_URL }) => {
  const { data: session } = useSession();
  const [likes, setLikes] = useState<Like[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [showAllLikes, setShowAllLikes] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Estado para gerenciar notificações Toast
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  // Função para exibir o Toast
  const showToast = useCallback((message: string, type: "success" | "error" | "info") => {
    setToast({ message, type });
  }, []);

  // Memoizar a função fetchLikes
  const fetchLikes = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/events/${albumId}/likes`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao carregar reações: ${response.status} - ${errorText}`);
      }
      const data: Like[] = await response.json();
      setLikes(data);
    } catch (error: any) {
      console.error("Erro ao carregar reações:", error.message || error);
      showToast("Não foi possível carregar as reações.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [albumId, API_BASE_URL, showToast]);

  useEffect(() => {
    if (!albumId || !API_BASE_URL) {
      console.error("albumId ou API_BASE_URL não estão definidos.");
      return;
    }
    fetchLikes();
  }, [albumId, API_BASE_URL, fetchLikes]);

  const removeReaction = async () => {
    if (!session) {
      showToast("Você precisa estar logado para remover uma reação.", "error");
      return;
    }

    const userName = session.user?.name ?? "Usuário Anônimo";

    try {
      const response = await fetch(`${API_BASE_URL}/events/${albumId}/likes`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: userName }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao remover reação: ${response.status} - ${errorText}`);
      }

      setLikes((prev) => prev.filter((like) => like.user !== userName));
      showToast("Reação removida com sucesso.", "success");
    } catch (error: any) {
      console.error("Erro ao remover reação:", error.message || error);
      showToast("Não foi possível remover a reação.", "error");
    }
  };

  const handleReaction = async (emoji: string) => {
    if (!session) {
      showToast("Você precisa estar logado para reagir.", "error");
      return;
    }

    const userName = session.user?.name ?? "Usuário Anônimo";

    const existingLike = likes.find((like) => like.user === userName);

    if (existingLike) {
      // Atualiza a reação do usuário
      try {
        const response = await fetch(`${API_BASE_URL}/events/${albumId}/likes`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user: userName, emoji }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erro ao atualizar reação: ${response.status} - ${errorText}`);
        }

        setLikes((prev) =>
          prev.map((like) =>
            like.user === userName ? { ...like, emoji } : like
          )
        );
        showToast("Reação atualizada com sucesso.", "success");
      } catch (error: any) {
        console.error("Erro ao atualizar reação:", error.message || error);
        showToast("Não foi possível atualizar a reação.", "error");
      }
    } else {
      // Adiciona uma nova reação
      try {
        const response = await fetch(`${API_BASE_URL}/events/${albumId}/likes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user: userName, emoji }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erro ao reagir: ${response.status} - ${errorText}`);
        }

        const newLike: Like = { user: userName, emoji, timestamp: new Date().toISOString() };
        setLikes((prev) => [...prev, newLike]);
        showToast("Reação adicionada com sucesso.", "success");
      } catch (error: any) {
        console.error("Erro ao reagir:", error.message || error);
        showToast("Não foi possível reagir ao evento.", "error");
      }
    }
  };

  return (
    <div className="relative">
      {/* Renderização do Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="flex items-center space-x-4">
        {/* Botão de Curtida */}
        <div
          className="relative"
          onMouseEnter={() => setShowEmojiPicker(true)}
          onMouseLeave={() => setShowEmojiPicker(false)}
        >
          <button
            onClick={() =>
              likes.some((like) => like.user === session?.user?.name)
                ? removeReaction()
                : null
            }
            className={`flex items-center ${
              likes.some((like) => like.user === session?.user?.name) ? "text-red-500" : "text-gray-400"
            } hover:text-red-600 focus:outline-none`}
            aria-label="Curtir evento"
            disabled={isLoading}
          >
            {likes.some((like) => like.user === session?.user?.name) ? <FaHeart /> : <FaRegHeart />}
            <span className="ml-1 text-white">{likes.length}</span>
          </button>

          {/* Menu de Emojis */}
          {showEmojiPicker && (
            <div className="absolute top-[-40px] left-0 bg-gray-800 text-white p-2 rounded shadow-lg flex space-x-2">
              {emojiOptions.map((option) => (
                <button
                  key={option.emoji}
                  onClick={() => handleReaction(option.emoji)}
                  className="text-lg hover:scale-110 transition-transform focus:outline-none"
                  title={option.label}
                >
                  {option.emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Exibição dos nomes */}
        {likes.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-300">
              {likes
                .slice(0, 3)
                .map((like) => `${like.user} ${like.emoji}`)
                .join(", ")}
            </span>
            {likes.length > 3 && (
              <button
                onClick={() => setShowAllLikes((prev) => !prev)}
                className="text-blue-400 hover:text-blue-500 underline text-sm focus:outline-none"
              >
                +{likes.length - 3} outros
              </button>
            )}
          </div>
        )}
      </div>

      {/* Lista Completa de Reações */}
      {showAllLikes && likes.length > 3 && (
        <div className="mt-4 bg-gray-800 text-white rounded shadow-lg p-4">
          <p className="font-semibold mb-2">Reações do Álbum:</p>
          <div
            className="max-h-32 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
            style={{ borderRadius: "8px" }}
          >
            {likes.map((like, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-gray-700 p-2 rounded-md"
              >
                <p className="text-sm">{like.user}</p>
                <div className="text-lg">{like.emoji}</div>
                <p className="text-xs text-gray-400">
                  {new Date(like.timestamp).toLocaleString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowAllLikes(false)}
            className="mt-2 text-blue-400 hover:text-blue-500 underline text-sm focus:outline-none"
          >
            Fechar
          </button>
        </div>
      )}
    </div>
  );
};

export default Likes;
