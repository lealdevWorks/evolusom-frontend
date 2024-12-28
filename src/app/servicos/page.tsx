"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image"; // Import Image from next/image
import { useToast } from "../../contexts/ToastContext"; 
import API_BASE_URL from "../../config/api";
import FullscreenViewer from "../eventos/FullscreenViewer"; // Import FullscreenViewer

// Define the Service type
type Service = {
  _id: string;
  name: string;
  description: string;
  coverImage: string;
  additionalImages: string[];
};

const ServicosPage: React.FC = () => {
  // State declarations
  const [services, setServices] = useState<Service[]>([]);
  const [displayedServices, setDisplayedServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [cart, setCart] = useState<Service[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Record<string, string[]>>({});
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);

  const { showToast } = useToast(); 

  const SERVICES_PER_PAGE = 6;

  // Fetch services function wrapped with useCallback
  const fetchServices = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/services`);
      if (!response.ok) {
        throw new Error("Erro ao carregar serviços.");
      }
      const data: Service[] = await response.json();
      setServices(data);
      setDisplayedServices(data.slice(0, SERVICES_PER_PAGE));
    } catch (error) {
      console.error("Erro ao carregar serviços:", error);
      showToast("Erro ao carregar serviços.", "error");
    }
  }, [showToast]);

  // useEffect to fetch services on component mount
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // useEffect to load cart from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Function to open service details modal
  const openServiceDetails = (service: Service) => {
    if (!loadedImages[service._id]) {
      setLoadedImages((prev) => ({
        ...prev,
        [service._id]: [
          `${API_BASE_URL}/services/image/${service._id}/coverImage`,
          ...service.additionalImages.map((_, index) =>
            `${API_BASE_URL}/services/image/${service._id}/additionalImages/${index}`
          ),
        ],
      }));
    }
    setSelectedService(service);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden'; // Evita o scroll de fundo quando o modal está aberto
  };

  // Function to close service details modal
  const closeServiceDetails = () => {
    setSelectedService(null);
    setIsModalOpen(false);
    document.body.style.overflow = 'auto'; // Restaura o scroll de fundo
  };

  // Function to add a service to the cart
  const addToCart = (service: Service) => {
    if (cart.some((item) => item._id === service._id)) {
      showToast(`O serviço "${service.name}" já está no carrinho.`, "info");
      return;
    }
    const updatedCart = [...cart, service];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    showToast(`O serviço "${service.name}" foi adicionado ao carrinho.`, "success");
  };

  // Function to load more services
  const loadMoreServices = () => {
    const currentCount = displayedServices.length;
    const nextServices = services.slice(currentCount, currentCount + SERVICES_PER_PAGE);
    setDisplayedServices((prev) => [...prev, ...nextServices]);
  };

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-20 py-10">
      <h1 className="text-3xl font-bold text-white text-center mb-8">Nossos Serviços</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayedServices.map((service) => (
          <div
            key={service._id}
            className="bg-gray-800 text-white p-6 rounded-lg shadow-lg hover:scale-105 transition-transform flex flex-col justify-between overflow-hidden"
          >
            <div className="relative w-full h-48 mb-4 cursor-pointer">
              <Image
                src={`${API_BASE_URL}/services/image/${service._id}/coverImage`}
                alt={service.name}
                fill
                className="object-cover rounded-lg"
                onClick={() => openServiceDetails(service)}
                priority // Use priority if this image is critical
              />
            </div>
            <h3 className="text-lg font-bold truncate">{service.name}</h3>
            <p className="mt-2 text-gray-300 truncate">
              {service.description.length > 100
                ? `${service.description.slice(0, 100)}...`
                : service.description}
            </p>
            <button
              onClick={() => openServiceDetails(service)}
              className="mt-4 text-orange-500 hover:text-orange-600"
            >
              Ver mais
            </button>
          </div>
        ))}
      </div>

      {displayedServices.length < services.length && (
        <div className="text-center mt-8">
          <button
            onClick={loadMoreServices}
            className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600"
          >
            Ver Mais
          </button>
        </div>
      )}

      {selectedService && isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 overflow-auto">
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg max-w-4xl w-full mx-4 md:mx-0 relative">
            <button
              onClick={closeServiceDetails}
              className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 z-50"
              aria-label="Fechar Modal"
            >
              &times;
            </button>
            <div className="flex flex-col lg:flex-row items-center lg:items-start mb-6">
              <div className="relative w-full h-64 lg:w-1/2 cursor-pointer mb-4 lg:mb-0">
                <Image
                  src={`${API_BASE_URL}/services/image/${selectedService._id}/coverImage`}
                  alt={selectedService.name}
                  fill
                  className="object-contain rounded-lg"
                  onClick={() => setIsImageViewerOpen(true)}
                />
              </div>
              <div className="lg:ml-6 w-full">
                <h2 className="text-2xl font-bold mb-4 break-words">{selectedService.name}</h2>
                <p className="mt-4 text-gray-300 mb-6 break-words">{selectedService.description}</p>
                <button
                  onClick={() => addToCart(selectedService)}
                  className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 w-full md:w-auto"
                >
                  Adicionar ao Carrinho
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isImageViewerOpen && selectedService && (
        <FullscreenViewer
          image={`${API_BASE_URL}/services/image/${selectedService._id}/coverImage`}
          images={[
            `${API_BASE_URL}/services/image/${selectedService._id}/coverImage`, 
            ...(loadedImages[selectedService._id] || [])
          ]}
          onClose={() => setIsImageViewerOpen(false)}
        />
      )}
    </main>
  );
};

export default ServicosPage;
