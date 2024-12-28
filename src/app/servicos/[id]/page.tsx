"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import API_BASE_URL from "../../../config/api"; 
import Image from "next/image"; 
import Toast from "../../../components/Toast"; 

type Service = {
  _id: string;
  name: string;
  description?: string;
  coverImage: string;
  additionalImages?: string[];
};

const ServiceDetails = () => {
  const [service, setService] = useState<Service | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();
  const params = useParams();

  // Estado para gerenciar notificações Toast
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  // Função para exibir o Toast
  const showToast = useCallback((message: string, type: "success" | "error" | "info") => {
    setToast({ message, type });
  }, []);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const id = params?.id;
        if (!id) throw new Error("ID do serviço não encontrado.");

        // Aqui usamos a base URL do seu backend:
        const response = await fetch(`${API_BASE_URL}/services/${id}`);
        if (!response.ok) {
          throw new Error("Erro ao buscar serviço.");
        }

        const data: Service = await response.json();
        setService(data);
      } catch (err: any) {
        setError("Serviço não encontrado. Você será redirecionado.");
        setTimeout(() => {
          router.push("/servicos");
        }, 3000);
      }
    };

    fetchService();
  }, [params, router]);

  const handleAddToCart = () => {
    if (!service) return;

    // Obter os itens do carrinho
    const cart: Service[] = JSON.parse(localStorage.getItem("cart") || "[]");

    // Verificar se o item já está no carrinho
    if (cart.some((item) => item._id === service._id)) {
      showToast("Este serviço já está no carrinho!", "info");
      return;
    }

    // Armazenar dados (incluindo description!)
    const serviceToAdd = {
      _id: service._id,
      name: service.name,
      description: service.description, // Agora também salvamos
      coverImage: service.coverImage,
    };

    try {
      localStorage.setItem("cart", JSON.stringify([...cart, serviceToAdd]));
      showToast("Serviço adicionado ao carrinho!", "success");
    } catch (error) {
      showToast("Erro ao adicionar ao carrinho. O armazenamento local pode estar cheio.", "error");
    }
  };

  const handleSendWhatsApp = () => {
    if (!service) return;

    const message = `Olá! Gostaria de um orçamento para o seguinte serviço:
• Nome: ${service.name}
• Descrição: ${service.description || "Sem descrição"}
    `;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=5551999068850&text=${encodedMessage}&type=phone_number&app_absent=0`;
    window.open(whatsappUrl, "_blank");
  };

  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Memoizar as funções nextImage e prevImage
  const nextImage = useCallback(() => {
    if (!service) return;
    const images = [service.coverImage, ...(service.additionalImages || [])];
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  }, [service]);

  const prevImage = useCallback(() => {
    if (!service) return;
    const images = [service.coverImage, ...(service.additionalImages || [])];
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [service]);

  useEffect(() => {
    // Event listener para controle do teclado no modal
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return;

      switch (e.key) {
        case "ArrowRight":
          nextImage();
          break;
        case "ArrowLeft":
          prevImage();
          break;
        case "Escape":
          closeModal();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, nextImage, prevImage]);

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>{error}</p>
        <p>Redirecionando...</p>
      </div>
    );
  }

  if (!service) {
    return <p className="text-center text-white">Carregando...</p>;
  }

  const images = [service.coverImage, ...(service.additionalImages || [])];

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-20 py-10">
      {/* Renderização do Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="bg-gray-900 text-white rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative group"
              onClick={() => openModal(index)}
            >
              <div className="w-full h-64 relative rounded-lg cursor-pointer hover:opacity-80 transition-opacity">
                <Image
                  src={image}
                  alt={`Imagem ${index + 1} do serviço`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
            </div>
          ))}
        </div>

        <h1 className="text-3xl font-bold mt-6">{service.name}</h1>
        <p className="mt-4">{service.description || "Sem descrição"}</p>

        <div className="flex space-x-4 mt-6">
          <button
            onClick={handleAddToCart}
            className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-transform transform hover:scale-105"
          >
            Adicionar ao Carrinho
          </button>
          <button
            onClick={handleSendWhatsApp}
            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-transform transform hover:scale-105"
          >
            Enviar no WhatsApp
          </button>
        </div>
      </div>

      {/* Modal de imagens */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
          >
            Fechar
          </button>
          <button
            onClick={prevImage}
            className="absolute left-4 text-white bg-black bg-opacity-50 p-3 rounded"
          >
            &#8249;
          </button>
          <div className="max-w-3xl max-h-[80vh] relative object-contain transition-transform duration-500">
            <Image
              src={images[currentImageIndex]}
              alt="Imagem ampliada"
              layout="fill"
              objectFit="contain"
              className="rounded"
            />
          </div>
          <button
            onClick={nextImage}
            className="absolute right-4 text-white bg-black bg-opacity-50 p-3 rounded"
          >
            &#8250;
          </button>
        </div>
      )}
    </main>
  );
};

export default ServiceDetails;
