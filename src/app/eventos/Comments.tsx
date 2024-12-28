"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import InfiniteScroll from "react-infinite-scroll-component";
import { FaRegSmile, FaTimes } from "react-icons/fa"; // Importando o ícone de "X"
import { format } from "date-fns";

// Emojis festivos e alegres
const festiveEmojis = [
  "🎉", "🎊", "😊", "😁", "😆", "🥳", "❤️", "💛", "💙", "💚", "🥰", "💐", "🎂", "🍾", "🍻", "🎈", "🎶", "💃", "🕺"
];

type Comment = {
  id: string;
  user: string;
  text: string;
  createdAt: string;
};

type CommentsProps = {
  eventId: string;
};

const COMMENTS_BATCH_SIZE = 3;
const INITIAL_DISPLAY_COUNT = 4;
const MAX_COMMENT_LENGTH = 500;

const Comments: React.FC<CommentsProps> = ({ eventId }) => {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [displayedComments, setDisplayedComments] = useState<Comment[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [expandedComment, setExpandedComment] = useState<string | null>(null);

  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const newCommentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://localhost:5000/api/comments/${eventId}/comments`);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erro ao carregar comentários: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        setComments(data);
        setDisplayedComments(data.slice(0, INITIAL_DISPLAY_COUNT)); // Exibe os primeiros 4 comentários
        if (data.length <= INITIAL_DISPLAY_COUNT) {
          setHasMore(false); // Se o número de comentários for menor ou igual a 4, não tem mais comentários
        }
      } catch (err: any) {
        console.error("Erro ao carregar os comentários:", err.message || err);
        setError(err.message || "Erro desconhecido ao carregar os comentários.");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [eventId]);

  const fetchMoreComments = () => {
    const currentLength = displayedComments.length;
    const nextComments = comments.slice(currentLength, currentLength + COMMENTS_BATCH_SIZE);
    setDisplayedComments((prev) => [...prev, ...nextComments]);
    if (displayedComments.length + nextComments.length >= comments.length) {
      setHasMore(false);
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      alert("O comentário não pode estar vazio.");
      return;
    }

    if (newComment.length > MAX_COMMENT_LENGTH) {
      alert(`O comentário não pode ter mais de ${MAX_COMMENT_LENGTH} caracteres.`);
      return;
    }

    if (!session || !session.user) {
      alert("Você precisa estar logado para comentar.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/comments/${eventId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: session.user.name || "Usuário Anônimo",
          text: newComment.trim(),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao enviar o comentário: ${response.status} - ${errorText}`);
      }

      await reloadComments();
      setNewComment(""); // Limpar campo de novo comentário
    } catch (err: any) {
      console.error("Erro ao enviar o comentário:", err.message || err);
      alert(err.message || "Erro desconhecido ao enviar o comentário.");
    }
  };

  const handleCommentEdit = async (commentId: string) => {
    if (!editText.trim()) {
      alert("O comentário não pode estar vazio.");
      return;
    }

    if (editText.length > MAX_COMMENT_LENGTH) {
      alert(`O comentário não pode ter mais de ${MAX_COMMENT_LENGTH} caracteres.`);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/comments/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: editText.trim() }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao editar o comentário: ${response.status} - ${errorText}`);
      }

      await reloadComments();
      setEditingComment(null);
    } catch (err: any) {
      console.error("Erro ao editar o comentário:", err.message || err);
      alert(err.message || "Erro desconhecido ao editar o comentário.");
    }
  };

  const handleCommentDelete = async (commentId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/comments/${commentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao excluir o comentário: ${response.status} - ${errorText}`);
      }

      await reloadComments();
    } catch (err: any) {
      console.error("Erro ao excluir o comentário:", err.message || err);
      alert(err.message || "Erro desconhecido ao excluir o comentário.");
    }
  };

  const reloadComments = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/comments/${eventId}/comments`);
      if (!response.ok) {
        throw new Error(`Erro ao recarregar comentários`);
      }
      const data = await response.json();
      setComments(data);
      setDisplayedComments(data.slice(0, INITIAL_DISPLAY_COUNT)); // Atualiza a lista de comentários exibidos
      setHasMore(data.length > INITIAL_DISPLAY_COUNT); // Se houver mais comentários
    } catch (err) {
      console.error("Erro ao recarregar os comentários:", err);
      setError("Erro ao recarregar os comentários.");
    }
  };

  const handleExpandComment = (commentId: string) => {
    setExpandedComment(expandedComment === commentId ? null : commentId);
  };

  const handleClickOutsideEmoji = useCallback((event: MouseEvent) => {
    if (
      emojiPickerRef.current &&
      !emojiPickerRef.current.contains(event.target as Node) &&
      !newCommentRef.current?.contains(event.target as Node)
    ) {
      setShowEmojiPicker(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideEmoji);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideEmoji);
    };
  }, [handleClickOutsideEmoji]);

  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold text-orange-500 mb-4">Comentários</h3>

      {loading && <p className="text-gray-500">Carregando comentários...</p>}
      {error && <p className="text-red-500">Erro: {error}</p>}

      <InfiniteScroll
        dataLength={displayedComments.length}
        next={fetchMoreComments}
        hasMore={hasMore}
        loader={<p className="text-gray-500">Carregando mais comentários...</p>}
      >
        <div className="space-y-4">
          {displayedComments.map((comment) => (
            <div key={comment.id} className="bg-gray-800 p-4 rounded-lg">
              <p className="text-gray-300"><strong>{comment.user}</strong></p>
              <p className="text-gray-500 text-sm">
                {format(new Date(comment.createdAt), "dd/MM/yyyy HH:mm")}
              </p>
              {editingComment === comment.id ? (
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full p-2 mt-2 bg-gray-700 text-white rounded"
                  maxLength={MAX_COMMENT_LENGTH} // Limite de caracteres na edição
                  rows={5} // Ajustando a altura do campo de edição
                ></textarea>
              ) : (
                <p className="text-white mt-2 break-words">
                  {comment.text.length > 500
                    ? `${comment.text.slice(0, 500)}...`
                    : comment.text}
                </p>
              )}

              {comment.text.length > 500 && !expandedComment && (
                <button
                  className="text-blue-500 mt-2"
                  onClick={() => handleExpandComment(comment.id)}
                >
                  Ver mais
                </button>
              )}

              {expandedComment === comment.id && (
                <p className="text-white mt-2">{comment.text}</p>
              )}

              {comment.user === session?.user?.name && (
                <div className="mt-2 space-x-2">
                  {editingComment === comment.id ? (
                    <>
                      <button
                        onClick={() => handleCommentEdit(comment.id)}
                        className="text-green-500"
                      >
                        Salvar
                      </button>
                      <button
                        onClick={() => setEditingComment(null)}
                        className="text-red-500"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditingComment(comment.id);
                          setEditText(comment.text); // Exibe o texto completo no editor
                        }}
                        className="text-blue-500"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleCommentDelete(comment.id)}
                        className="text-red-500"
                      >
                        Excluir
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </InfiniteScroll>

      <div className="mt-4 relative">
        <textarea
          ref={newCommentRef}
          placeholder="Adicione seu comentário"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value.slice(0, MAX_COMMENT_LENGTH))}
          className="w-full p-2 rounded bg-gray-700 text-white resize-none"
          rows={3}
        ></textarea>

        <button
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          className="absolute right-10 top-2 text-xl text-gray-400 hover:text-white"
        >
          <FaRegSmile />
        </button>

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div ref={emojiPickerRef} className="absolute bottom-16 right-0 z-10 w-60 bg-gray-800 rounded-md p-2 shadow-lg">
            <button
              onClick={() => setShowEmojiPicker(false)}
              className="absolute top-2 right-2 z-20 text-2xl text-white"
            >
              <FaTimes />
            </button>
            <div className="grid grid-cols-4 gap-2">
              {festiveEmojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => setNewComment((prev) => prev + emoji)}
                  className="text-3xl p-2 hover:bg-gray-600 rounded-md"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleCommentSubmit}
          className="bg-orange-500 text-white px-4 py-2 rounded mt-4 hover:bg-orange-600"
        >
          Comentar
        </button>
      </div>
    </div>
  );
};

export default Comments;
