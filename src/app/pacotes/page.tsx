'use client';

import { useState } from 'react';

export default function Pacotes() {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [additionalNotes, setAdditionalNotes] = useState('');

  const services = [
    { id: 1, name: 'Sonorização Completa' },
    { id: 2, name: 'Iluminação' },
    { id: 3, name: 'DJ para Eventos' },
  ];

  // Função para lidar com a seleção e desmarcação dos serviços
  const handleSelect = (service: string) => {
    const newSelectedItems = new Set(selectedItems);
    if (newSelectedItems.has(service)) {
      newSelectedItems.delete(service);
    } else {
      newSelectedItems.add(service);
    }
    setSelectedItems(newSelectedItems);
  };

  // Enviar a mensagem para o WhatsApp
  const handleSendToWhatsApp = () => {
    const message = `Olá, gostaria de um orçamento para o seguinte pacote personalizado:
${Array.from(selectedItems).map((item) => `- ${item}`).join('\n')}
Notas adicionais: ${additionalNotes || 'Nenhuma.'}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/5551999999999?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');
  };

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-20 py-10">
      {/* Título */}
      <h1 className="text-3xl sm:text-4xl font-bold text-white text-center">Personalize Seu Pacote</h1>
      <p className="mt-4 text-gray-300 text-center max-w-3xl mx-auto">
        Escolha os serviços abaixo e adicione notas adicionais para criar um pacote exclusivo.
      </p>

      {/* Lista de Serviços */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-gray-900 p-4 rounded-lg flex items-center justify-between shadow-lg hover:shadow-xl transition-shadow"
          >
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                className="w-5 h-5 text-orange-500"
                checked={selectedItems.has(service.name)}
                onChange={() => handleSelect(service.name)}
                aria-checked={selectedItems.has(service.name)}
              />
              <span className="text-gray-300">{service.name}</span>
            </label>
          </div>
        ))}
      </div>

      {/* Notas Adicionais */}
      <div className="mt-8">
        <label className="block text-gray-400 font-medium mb-2">Notas adicionais:</label>
        <textarea
          className="w-full border border-gray-700 bg-gray-800 text-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
          rows={4}
          value={additionalNotes}
          onChange={(e) => setAdditionalNotes(e.target.value)}
          placeholder="Alguma observação sobre o pacote?"
        ></textarea>
      </div>

      {/* Botão de Envio */}
      <button
        onClick={handleSendToWhatsApp}
        className="mt-6 bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 transition-colors"
        disabled={selectedItems.size === 0}
      >
        Enviar para WhatsApp
      </button>
    </main>
  );
}
