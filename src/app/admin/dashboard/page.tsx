'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import {
  FaTools,
  FaEdit,
  FaClipboardList,
  FaFileInvoice,
  FaCalendarPlus,
  FaTag,
} from 'react-icons/fa';

const AdminDashboard = () => {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const validateToken = async () => {
      // Obter o token dos cookies
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('auth-token='))?.split('=')[1];

      if (!token) {
        alert('Sessão expirada. Faça login novamente.');
        return router.push('/login');
      }

      try {
        // Verificar o token com o backend
        const response = await fetch('http://localhost:5000/api/auth/validate', {
          headers: { Authorization: token },
        });

        if (!response.ok) {
          throw new Error('Sessão expirada.');
        }
      } catch (error) {
        console.error('Erro ao validar token:', error);
        alert('Sessão expirada. Faça login novamente.');
        router.push('/login');
      }
    };

    validateToken();
  }, [pathname, router]);

  const handleLogout = () => {
    // Remover o token do cookie
    document.cookie = 'auth-token=; path=/; max-age=0';
    alert('Você foi desconectado.');
    router.push('/login');
  };

  return (
    <main className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-white mb-8 text-center">
        Painel Administrativo
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link href="/admin/servicos">
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg hover:bg-gray-700 transition-colors cursor-pointer">
            <h2 className="text-xl font-semibold flex items-center">
              <FaTools className="mr-2 text-orange-500" /> Gerenciar Serviços
            </h2>
          </div>
        </Link>
        <Link href="/admin/about">
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg hover:bg-gray-700 transition-colors cursor-pointer">
            <h2 className="text-xl font-semibold flex items-center">
              <FaEdit className="mr-2 text-blue-400" /> Editar Sobre Nós
            </h2>
          </div>
        </Link>
        <Link href="/admin/pacotes">
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg hover:bg-gray-700 transition-colors cursor-pointer">
            <h2 className="text-xl font-semibold flex items-center">
              <FaClipboardList className="mr-2 text-yellow-400" /> Visualizar Pacotes
            </h2>
          </div>
        </Link>
        <Link href="/admin/orcamentos">
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg hover:bg-gray-700 transition-colors cursor-pointer">
            <h2 className="text-xl font-semibold flex items-center">
              <FaFileInvoice className="mr-2 text-green-400" /> Visualizar Orçamentos
            </h2>
          </div>
        </Link>
        <Link href="/admin/eventos/novo">
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg hover:bg-gray-700 transition-colors cursor-pointer">
            <h2 className="text-xl font-semibold flex items-center">
              <FaCalendarPlus className="mr-2 text-pink-400" /> Adicionar Eventos
            </h2>
          </div>
        </Link>
        <Link href="/admin/categorias">
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg hover:bg-gray-700 transition-colors cursor-pointer">
            <h2 className="text-xl font-semibold flex items-center">
              <FaTag className="mr-2 text-purple-500" /> Gerenciar Categorias
            </h2>
          </div>
        </Link>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 transition-transform transform hover:scale-105"
        >
          Sair
        </button>
      </div>
    </main>
  );
};

export default AdminDashboard;
