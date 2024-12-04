'use client';

import { useState } from 'react';

export default function Pacotes() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [additionalNotes, setAdditionalNotes] = useState('');

  const services = [
    { id: 1, name: 'Sonorização Completa' },
    { id: 2, name: 'Iluminação' },
    { id: 3, name: 'DJ para Eventos' },
  ];

  const handleSelect = (service: string) => {
    if (selectedItems.includes(service)) {
      setSelectedItems(selectedItems.filter((item) => item !== service));
    } else {
      setSelectedItems([...selectedItems, service]);
    }
  };

  const handleSendToWhatsApp = () => {
    const message = `Olá, gostaria de um orçamento para o seguinte pacote personalizado:
${selectedItems.map((item) => `- ${item}`).join('\n')}
Notas adicionais: ${additionalNotes || 'Nenhuma.'}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/5551999999999?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');
  };

  return (
    <main className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-800">Personalize Seu Pacote</h1>
      <p className="mt-4 text-gray-600">
        Escolha os serviços abaixo e adicione notas adicionais para criar um pacote exclusivo.
      </p>

      <div className="mt-6 space-y-4">
        {services.map((service) => (
          <div key={service.id}>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                className="w-5 h-5 text-blue-500"
                onChange={() => handleSelect(service.name)}
              />
              <span className="text-gray-800">{service.name}</span>
            </label>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <label className="block text-gray-700 font-medium">Notas adicionais:</label>
        <textarea
          className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          value={additionalNotes}
          onChange={(e) => setAdditionalNotes(e.target.value)}
          placeholder="Alguma observação sobre o pacote?"
        ></textarea>
      </div>

      <button
        onClick={handleSendToWhatsApp}
        className="mt-6 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
      >
        Enviar para WhatsApp
      </button>
    </main>
  );
}
