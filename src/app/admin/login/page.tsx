'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simula a verificação da senha
    setTimeout(() => {
      if (password === 'admin123') {
        document.cookie = 'auth-token=valid; path=/; max-age=3600; Secure; SameSite=Strict';
        router.push('/admin/dashboard');
      } else {
        setError('Senha incorreta!');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <main className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Admin Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
          <button
            type="submit"
            className="mt-4 w-full bg-orange-500 py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors"
            disabled={loading}
          >
            {loading ? 'Carregando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </main>
  );
};

export default LoginPage;
