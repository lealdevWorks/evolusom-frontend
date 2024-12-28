"use client";

import { useEffect, useState } from "react";
import API_BASE_URL from "../../../config/api";

type Budget = {
  _id: string;
  nome: string;
  evento: string;
  data: string;
  cidade: string;
  local: string;
  tipo: string;
  totalPrice?: number;
  createdAt: string;
};

const OrcamentosPage = () => {
  const [orcamentos, setOrcamentos] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("createdAt");

  useEffect(() => {
    const fetchOrcamentos = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/orders`);
        if (!response.ok) {
          throw new Error("Erro ao buscar orçamentos. Verifique o servidor.");
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Dados inválidos recebidos do servidor.");
        }

        setOrcamentos(data);
      } catch (error) {
        console.error("Erro ao buscar orçamentos:", error);
        setError(error instanceof Error ? error.message : "Erro desconhecido.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrcamentos();
  }, []);

  const filteredOrcamentos = orcamentos.filter((orcamento) =>
    orcamento.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
    orcamento.evento.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedOrcamentos = [...filteredOrcamentos].sort((a, b) => {
    if (sortBy === "createdAt") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === "totalPrice") {
      return (b.totalPrice || 0) - (a.totalPrice || 0);
    }
    return 0;
  });

  if (loading) {
    return <p className="text-center text-gray-300">Carregando orçamentos...</p>;
  }

  if (error) {
    return (
      <p className="text-center text-red-500">
        {error} - Tente novamente mais tarde.
      </p>
    );
  }

  if (orcamentos.length === 0) {
    return <p className="text-center text-gray-300">Nenhum orçamento encontrado.</p>;
  }

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-20 py-10">
      <h1 className="text-3xl font-bold text-white mb-6">Orçamentos Solicitados</h1>

      {/* Campo de Busca */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nome ou evento..."
          className="w-full p-2 border border-gray-700 bg-gray-800 text-gray-300 rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Ordenação */}
      <div className="mb-4">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-2 border border-gray-700 bg-gray-800 text-gray-300 rounded"
        >
          <option value="createdAt">Mais Recentes</option>
          <option value="totalPrice">Maior Preço</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full text-left text-gray-300">
          <thead>
            <tr className="bg-gray-800">
              <th className="px-4 py-2 text-xs md:text-sm">Nome</th>
              <th className="px-4 py-2 text-xs md:text-sm">Evento</th>
              <th className="px-4 py-2 text-xs md:text-sm">Data</th>
              <th className="px-4 py-2 text-xs md:text-sm">Cidade</th>
              <th className="px-4 py-2 text-xs md:text-sm">Local</th>
              <th className="px-4 py-2 text-xs md:text-sm">Tipo</th>
              <th className="px-4 py-2 text-xs md:text-sm">Total</th>
              <th className="px-4 py-2 text-xs md:text-sm">Criado Em</th>
            </tr>
          </thead>
          <tbody>
            {sortedOrcamentos.map((orcamento) => (
              <tr
                key={orcamento._id}
                className="border-t border-gray-700 hover:bg-gray-800 transition-colors"
              >
                <td className="px-4 py-2 text-xs md:text-sm">{orcamento.nome || "N/A"}</td>
                <td className="px-4 py-2 text-xs md:text-sm">{orcamento.evento || "N/A"}</td>
                <td className="px-4 py-2 text-xs md:text-sm">
                  {orcamento.data
                    ? new Date(orcamento.data).toLocaleDateString()
                    : "Data não informada"}
                </td>
                <td className="px-4 py-2 text-xs md:text-sm">{orcamento.cidade || "N/A"}</td>
                <td className="px-4 py-2 text-xs md:text-sm">{orcamento.local || "N/A"}</td>
                <td className="px-4 py-2 text-xs md:text-sm">{orcamento.tipo || "N/A"}</td>
                <td className="px-4 py-2 text-xs md:text-sm">
                  R$ {orcamento.totalPrice?.toFixed(2) || "0.00"}
                </td>
                <td className="px-4 py-2 text-xs md:text-sm">
                  {orcamento.createdAt
                    ? new Date(orcamento.createdAt).toLocaleDateString()
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default OrcamentosPage;
