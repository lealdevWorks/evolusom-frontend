// frontend/src/contexts/ToastContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from "react";
import Toast from "../components/Toast";

type ToastType = "success" | "error" | "info";

type ToastContextType = {
  showToast: (message: string, type: ToastType, action?: React.ReactNode) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast deve ser usado dentro de um ToastProvider");
  }
  return context;
};

type ToastProviderProps = {
  children: ReactNode;
};

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
    visible: boolean;
    action?: React.ReactNode;
  }>({ message: "", type: "success", visible: false, action: undefined });

  const showToast = (message: string, type: ToastType, action?: React.ReactNode) => {
    setToast({ message, type, visible: true, action });
  };

  const closeToast = () => {
    setToast((prev) => ({ ...prev, visible: false }));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast.visible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
          action={toast.action}
        />
      )}
    </ToastContext.Provider>
  );
};
