'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    if (password === 'admin123') {
      router.push('/admin/dashboard');
    } else {
      setError('Senha incorreta!');
    }
  };

  return (
    <main className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Admin Login</h1>
        <input
          type="password"
          className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Digite sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        <button
          onClick={handleLogin}
          className="mt-4 w-full bg-orange-500 py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Entrar
        </button>
      </div>
    </main>
  );
};

export default AdminLogin;
