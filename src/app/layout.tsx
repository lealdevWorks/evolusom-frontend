'use client';

import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { CartProvider } from '../context/CartContext'; // Importa o CartProvider
import { ToastProvider } from '../contexts/ToastContext'; // Importa o ToastProvider
import { SessionProvider } from "next-auth/react"; // Importa o SessionProvider

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-black text-white">
        <SessionProvider> {/* Envolve a aplicação com o SessionProvider */}
          <ToastProvider> {/* Envolve tudo com o ToastProvider */}
            <CartProvider> {/* Envolve tudo com o CartProvider */}
              <Header />
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
                className="min-h-screen"
              >
                {children}
              </motion.div>
              <Footer />
            </CartProvider>
          </ToastProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
