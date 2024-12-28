'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import API_BASE_URL from '../../../config/api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Verificar se o token ainda é válido ao carregar a página
  useEffect(() => {
    const validateToken = async () => {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('auth-token='))?.split('=')[1];

      if (token) {
        try {
          const response = await fetch(`${API_BASE_URL}/auth/validate`, {
            headers: { Authorization: token },
          });

          if (response.ok) {
            // Token válido, redirecionar para o dashboard
            router.push('/admin/dashboard');
          }
        } catch (error) {
          console.error('Erro ao validar token:', error);
        }
      }
    };

    validateToken();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        document.cookie = `auth-token=${data.token}; path=/; max-age=3600; Secure; SameSite=Strict`;
        router.push('/admin/dashboard');
      } else if (response.status === 401) {
        setError('Email ou senha inválidos.');
      } else {
        setError(data.error || 'Erro ao efetuar login. Tente novamente mais tarde.');
      }
    } catch (err) {
      console.error('Erro ao conectar ao servidor:', err);
      setError('Erro no servidor. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Admin Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
          />
          <input
            type="password"
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
          />
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
          <button
            type="submit"
            className={`mt-4 w-full py-2 px-4 rounded-lg ${
              loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'
            } transition-colors`}
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
