'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

const AdminDashboard = () => {
  const router = useRouter();

  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('auth-token='))
      ?.split('=')[1];

    if (token !== 'valid') {
      router.push('/login'); // Redireciona para a página de login se o token não for válido
    }
  }, [router]);

  const handleLogout = () => {
    document.cookie = 'auth-token=; path=/; max-age=0'; // Remove o cookie de autenticação
    router.push('/login'); // Redireciona para a página de login
  };

  return (
    <main className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-white mb-6">Painel Administrativo</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <Link href="/admin/servicos">
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg hover:bg-gray-700 transition-colors cursor-pointer">
            <h2 className="text-xl font-semibold">Gerenciar Serviços</h2>
          </div>
        </Link>
        <Link href="/admin/about">
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg hover:bg-gray-700 transition-colors cursor-pointer">
            <h2 className="text-xl font-semibold">Editar Sobre Nós</h2>
          </div>
        </Link>
        <Link href="/admin/pacotes">
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg hover:bg-gray-700 transition-colors cursor-pointer">
            <h2 className="text-xl font-semibold">Visualizar Pacotes</h2>
          </div>
        </Link>
      </div>

      {/* Botão de Logout */}
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
      >
        Sair
      </button>
    </main>
  );
};

export default AdminDashboard;
