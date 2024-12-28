// frontend/src/components/Toast.tsx
'use client';

import { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";

type ToastProps = {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
  action?: React.ReactNode; // Ação opcional
};

const Toast = ({ message, type, onClose, action }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const toastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Timer para iniciar a animação de saída após 3 segundos
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000); // 3 segundos

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleTransitionEnd = (e: TransitionEvent) => {
      if (!isVisible) {
        onClose();
      }
    };

    const currentToast = toastRef.current;
    if (currentToast) {
      currentToast.addEventListener("transitionend", handleTransitionEnd);
    }

    return () => {
      if (currentToast) {
        currentToast.removeEventListener("transitionend", handleTransitionEnd);
      }
    };
  }, [isVisible, onClose]);

  // Definir cores com base no tipo de toast, ajustando "info" para a cor do site (exemplo: laranja)
  const bgColor =
    type === "success"
      ? "bg-green-500"
      : type === "error"
      ? "bg-red-500"
      : "bg-orange-500"; // Ajuste conforme a cor do seu site

  const icon =
    type === "success" ? (
      // Ícone de tick (sucesso)
      <svg
        className="w-6 h-6 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ) : type === "error" ? (
      // Ícone de erro
      <svg
        className="w-6 h-6 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ) : (
      // Ícone de informação (ajustado para a cor do site)
      <svg
        className="w-6 h-6 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
      </svg>
    );

  // Verificar se o DOM está disponível (importante para Next.js)
  if (typeof window === "undefined") {
    return null;
  }

  return ReactDOM.createPortal(
    <div
      ref={toastRef}
      className={`fixed top-5 right-5 flex items-center ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg z-[60]
        transform transition-all duration-500
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
    >
      <div className="mr-3">{icon}</div>
      <div className="flex-1">{message}</div>
      {action && <div className="ml-4">{action}</div>}
      <button onClick={() => setIsVisible(false)} className="ml-4 focus:outline-none" aria-label="Fechar notificação">
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>,
    document.body // Renderizar no body
  );
};

export default Toast;
