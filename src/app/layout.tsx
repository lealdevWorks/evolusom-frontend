'use client';

import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-black text-white">
        <Header />
        <motion.div
          initial={{ opacity: 0, y: 50 }} // Transição ao entrar na página
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }} // Transição ao sair da página
          transition={{ duration: 0.5 }} // Duração da transição
          className="min-h-screen"
        >
          {children}
        </motion.div>
        <Footer />
      </body>
    </html>
  );
}
