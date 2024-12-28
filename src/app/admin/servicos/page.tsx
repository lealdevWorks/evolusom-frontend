"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Toast from "@/components/Toast"; 

type Service = {
  _id: string;
  name: string;
  description: string;
  coverImageURL: string;
  additionalImagesURLs: string[];
};

const AdminServicos = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [newService, setNewService] = useState({ name: "", description: "" });
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [newAdditionalFiles, setNewAdditionalFiles] = useState<File[]>([]);
  const [newAdditionalPreviews, setNewAdditionalPreviews] = useState<string[]>([]);
  const [removedImages, setRemovedImages] = useState<number[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [toasts, setToasts] = useState<
    { id: number; message: string; type: "success" | "error" | "info" }[]
  >([]);
  const toastIdRef = useRef(0);

  const addToast = (message: string, type: "success" | "error" | "info" = "info") => {
    const id = toastIdRef.current++;
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);
  };

  const removeToast = (id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  const router = useRouter();
  const coverImageRef = useRef<HTMLInputElement>(null);
  const additionalImagesRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const MAX_DESCRIPTION_LENGTH = 1000;
  const MAX_ADDITIONAL_IMAGES = 10;
  const REQUIRED_TOTAL_IMAGES = 1;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ["image/jpeg", "image/png"];
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  // State para tratar imagens de fallback
  const [fallbackImages, setFallbackImages] = useState<{ [key: string]: boolean }>({});

  const handleImageError = (id: string) => {
    setFallbackImages((prev) => ({ ...prev, [id]: true }));
  };

  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${backendURL}/api/services`);
      if (!response.ok) throw new Error("Erro ao carregar serviços.");
      const data = await response.json();
      const processedData = data.map((service: any) => ({
        _id: service._id,
        name: service.name,
        description: service.description,
        coverImageURL: `${backendURL}/api/services/image/${service._id}/coverImage`,
        additionalImagesURLs: service.additionalImages.map((_: any, index: number) =>
          `${backendURL}/api/services/image/${service._id}/additionalImages/${index}`
        ),
      }));
      setServices(processedData);
    } catch (error) {
      console.error("Erro ao carregar serviços:", error);
      addToast("Erro ao carregar serviços. Tente novamente mais tarde.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [backendURL]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  useEffect(() => {
    if (descriptionRef.current) {
      descriptionRef.current.style.height = "auto";
      descriptionRef.current.style.height = `${descriptionRef.current.scrollHeight}px`;
    }
  }, [newService.description]);

  const handleRemoveCoverImage = () => {
    if (coverImagePreview) {
      if (coverImagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(coverImagePreview);
      }
      setCoverImage(null);
      setCoverImagePreview(null);
      if (coverImageRef.current) coverImageRef.current.value = "";
      if (additionalImages.length > 0) {
        const newCover = additionalImages[0];
        setCoverImagePreview(newCover);
        setEditingService((prev) =>
          prev ? { ...prev, coverImageURL: newCover } : prev
        );
        setAdditionalImages((prev) => prev.slice(1));
      }
    }
  };

  const handleSetAsCover = (index: number, isNew: boolean) => {
    if (isNew) {
      const selectedPreview = newAdditionalPreviews[index];
      const selectedFile = newAdditionalFiles[index];
      setCoverImagePreview(selectedPreview);
      setCoverImage(selectedFile);
      setNewAdditionalPreviews((prev) => prev.filter((_, i) => i !== index));
      setNewAdditionalFiles((prev) => prev.filter((_, i) => i !== index));
      if (coverImagePreview) {
        setAdditionalImages((prev) => [coverImagePreview, ...prev]);
      }
    } else {
      if (index < 0 || index >= additionalImages.length) return;
      const selectedImage = additionalImages[index];
      if (coverImagePreview) {
        setAdditionalImages((prev) => [coverImagePreview, ...prev]);
      }
      setCoverImagePreview(selectedImage);
      setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleRemoveExistingAdditionalImage = (index: number) => {
    setRemovedImages((prev) => [...prev, index]);
    setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveNewAdditionalImage = (index: number) => {
    const previewToRemove = newAdditionalPreviews[index];
    URL.revokeObjectURL(previewToRemove);
    setNewAdditionalFiles((prev) => prev.filter((_, i) => i !== index));
    setNewAdditionalPreviews((prev) => prev.filter((_, i) => i !== index));
    if (additionalImagesRef.current) additionalImagesRef.current.value = "";
  };

  const handleRemoveImage = (index: number, isAdditional: boolean, isExisting: boolean) => {
    if (isAdditional) {
      if (isExisting) {
        handleRemoveExistingAdditionalImage(index);
      } else {
        handleRemoveNewAdditionalImage(index);
      }
    } else {
      handleRemoveCoverImage();
    }
  };

  const handleSaveService = async () => {
    const totalImages = (coverImagePreview ? 1 : 0) + additionalImages.length + newAdditionalPreviews.length;
    if (!newService.name || !newService.description || totalImages < REQUIRED_TOTAL_IMAGES) {
      addToast("Preencha todos os campos e envie pelo menos uma imagem de capa.", "error");
      return;
    }
    if (newService.description.length > MAX_DESCRIPTION_LENGTH) {
      addToast("A descrição não pode exceder 1000 caracteres.", "error");
      return;
    }
    if (totalImages > REQUIRED_TOTAL_IMAGES + MAX_ADDITIONAL_IMAGES) {
      addToast(`Você pode adicionar no máximo ${MAX_ADDITIONAL_IMAGES} imagens adicionais.`, "error");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", newService.name);
      formData.append("description", newService.description);

      if (editingService) {
        formData.append("removedAdditionalImages", JSON.stringify(removedImages));
      }

      if (coverImage) {
        formData.append("coverImage", coverImage);
      }

      if (newAdditionalFiles.length > 0) {
        newAdditionalFiles.forEach((file) => {
          formData.append("additionalImages", file);
        });
      }

      const url = editingService
        ? `${backendURL}/api/services/${editingService._id}`
        : `${backendURL}/api/services`;
      const method = editingService ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        console.error("Erro do backend:", errorDetails);
        throw new Error("Erro ao salvar serviço.");
      }

      await fetchServices();
      setNewService({ name: "", description: "" });

      if (coverImagePreview && coverImagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(coverImagePreview);
      }
      setCoverImage(null);
      setCoverImagePreview(null);
      setAdditionalImages([]);
      setNewAdditionalFiles([]);
      newAdditionalPreviews.forEach((preview) => {
        if (preview.startsWith("blob:")) {
          URL.revokeObjectURL(preview);
        }
      });
      setNewAdditionalPreviews([]);
      setRemovedImages([]);
      setEditingService(null);

      if (coverImageRef.current) coverImageRef.current.value = "";
      if (additionalImagesRef.current) additionalImagesRef.current.value = "";

      addToast("Serviço salvo com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao salvar serviço:", error);
      addToast("Erro ao salvar serviço. Verifique os dados e tente novamente.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover este serviço?")) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${backendURL}/api/services/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Erro ao remover serviço.");
      await fetchServices();
      addToast("Serviço removido com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao remover serviço:", error);
      addToast("Erro ao remover serviço.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditService = (service: Service) => {
    setNewService({ name: service.name, description: service.description });
    setEditingService(service);
    setCoverImagePreview(service.coverImageURL);
    setAdditionalImages([...service.additionalImagesURLs]);
    setNewAdditionalFiles([]);
    setNewAdditionalPreviews([]);
    setRemovedImages([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = () => {
    document.cookie = "auth-token=; path=/; max-age=0";
    router.push("/");
  };

  useEffect(() => {
    return () => {
      if (coverImagePreview && coverImagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(coverImagePreview);
      }
      additionalImages.forEach((url) => {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
      });
      newAdditionalPreviews.forEach((url) => {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
      });
    };
  }, [coverImagePreview, additionalImages, newAdditionalPreviews]);

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Gerenciar Serviços</h1>
        <button
          onClick={handleLogout}
          className="mt-4 md:mt-0 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors"
          aria-label="Sair"
        >
          Sair
        </button>
      </div>

      <div className="mb-6 bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-4">
          {editingService ? "Editar Serviço" : "Adicionar Serviço"}
        </h2>

        {(coverImagePreview || additionalImages.length > 0 || newAdditionalPreviews.length > 0) && (
          <div className="flex flex-wrap gap-4 mb-4">
            {coverImagePreview && (
              <div className="relative h-24 w-24">
                <div className="relative h-full w-full">
                  <Image
                    src={fallbackImages["cover"] ? "/default-image.png" : coverImagePreview}
                    alt="Pré-visualização de Capa"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg shadow-md"
                    onError={() => handleImageError("cover")}
                  />
                </div>
                <button
                  onClick={() => handleRemoveImage(-1, false, false)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                  aria-label="Remover imagem de capa"
                >
                  ×
                </button>
              </div>
            )}

            {additionalImages.map((imageURL, index) => (
              <div key={`existing-${index}`} className="relative h-24 w-24">
                <div className="relative h-full w-full">
                  <Image
                    src={fallbackImages[`additional-${index}`] ? "/default-image.png" : imageURL}
                    alt={`Pré-visualização Adicional ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg shadow-md"
                    onError={() => handleImageError(`additional-${index}`)}
                  />
                </div>
                <button
                  onClick={() => handleRemoveImage(index, true, true)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                  aria-label="Remover imagem adicional"
                >
                  ×
                </button>
                <button
                  onClick={() => handleSetAsCover(index, false)}
                  className="absolute bottom-1 left-1 bg-blue-600 text-white rounded-full p-0.5 hover:bg-blue-700 text-xs"
                  aria-label="Definir como Capa"
                >
                  Definir
                </button>
              </div>
            ))}

            {newAdditionalPreviews.map((image, index) => (
              <div key={`new-${index}`} className="relative h-24 w-24">
                <div className="relative h-full w-full">
                  <Image
                    src={fallbackImages[`new-${index}`] ? "/default-image.png" : image}
                    alt={`Pré-visualização Nova Adicional ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg shadow-md"
                    onError={() => handleImageError(`new-${index}`)}
                  />
                </div>
                <button
                  onClick={() => handleRemoveImage(index, true, false)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                  aria-label="Remover nova imagem adicional"
                >
                  ×
                </button>
                <button
                  onClick={() => handleSetAsCover(index, true)}
                  className="absolute bottom-1 left-1 bg-blue-600 text-white rounded-full p-0.5 hover:bg-blue-700 text-xs"
                  aria-label="Definir como Capa"
                >
                  Definir
                </button>
              </div>
            ))}
          </div>
        )}

        <input
          type="text"
          placeholder="Nome do Serviço"
          value={newService.name}
          onChange={(e) => setNewService({ ...newService, name: e.target.value })}
          className="w-full p-3 mb-4 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          aria-label="Nome do Serviço"
        />
        <textarea
          ref={descriptionRef}
          placeholder="Descrição"
          value={newService.description}
          onChange={(e) => setNewService({ ...newService, description: e.target.value })}
          className="w-full p-3 mb-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
          maxLength={MAX_DESCRIPTION_LENGTH}
          aria-label="Descrição do Serviço"
          style={{ height: "auto", minHeight: "80px", overflow: "hidden" }}
        ></textarea>
        <p className="text-right text-gray-400 mb-4">
          {newService.description.length}/{MAX_DESCRIPTION_LENGTH} caracteres
        </p>

        <p className="text-right text-gray-400 mb-4">
          {coverImagePreview
            ? additionalImages.length + newAdditionalPreviews.length < MAX_ADDITIONAL_IMAGES
              ? `Você pode adicionar mais ${
                  MAX_ADDITIONAL_IMAGES - (additionalImages.length + newAdditionalPreviews.length)
                } imagens adicionais.`
              : additionalImages.length + newAdditionalPreviews.length > MAX_ADDITIONAL_IMAGES
              ? `Você precisa remover ${
                  additionalImages.length + newAdditionalPreviews.length - MAX_ADDITIONAL_IMAGES
                } imagens adicionais para atingir o limite.`
              : "Você atingiu o limite máximo de imagens adicionais."
            : "Por favor, adicione uma imagem de capa."}
        </p>

        <label className="block mb-4">
          <span className="text-gray-300">Selecione a Foto de Capa</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const files = e.target.files;
              if (files && files[0]) {
                const file = files[0];
                if (!ALLOWED_TYPES.includes(file.type)) {
                  addToast(`Tipo de arquivo não suportado: ${file.type}`, "error");
                  return;
                }
                if (file.size > MAX_FILE_SIZE) {
                  addToast(`O arquivo ${file.name} excede o tamanho máximo de 5MB.`, "error");
                  return;
                }
                setCoverImage(file);
                if (coverImagePreview && coverImagePreview.startsWith("blob:")) {
                  URL.revokeObjectURL(coverImagePreview);
                }
                setCoverImagePreview(URL.createObjectURL(file));
              }
            }}
            className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            ref={coverImageRef}
            aria-label="Upload de Imagem de Capa"
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-300">Adicione mais Fotos</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = e.target.files;
              if (files) {
                const validFiles = Array.from(files).filter((file) => {
                  if (!ALLOWED_TYPES.includes(file.type)) {
                    addToast(`Tipo de arquivo não suportado: ${file.type}`, "error");
                    return false;
                  }
                  if (file.size > MAX_FILE_SIZE) {
                    addToast(`O arquivo ${file.name} excede o tamanho máximo de 5MB.`, "error");
                    return false;
                  }
                  return true;
                });

                const remaining = MAX_ADDITIONAL_IMAGES - (additionalImages.length + newAdditionalPreviews.length);
                if (validFiles.length > remaining) {
                  addToast(`Você pode adicionar no máximo ${remaining} imagens adicionais.`, "error");
                  return;
                }

                setNewAdditionalFiles((prev) => [...prev, ...validFiles]);
                const previews = validFiles.map((file) => URL.createObjectURL(file));
                setNewAdditionalPreviews((prev) => [...prev, ...previews]);
              }
            }}
            className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            disabled={additionalImages.length + newAdditionalPreviews.length >= MAX_ADDITIONAL_IMAGES}
            ref={additionalImagesRef}
            aria-label="Upload de Imagens Adicionais"
          />
        </label>

        <button
          onClick={handleSaveService}
          disabled={
            !newService.name ||
            !newService.description ||
            !coverImagePreview ||
            (additionalImages.length + newAdditionalPreviews.length) > MAX_ADDITIONAL_IMAGES ||
            isLoading
          }
          className={`w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-opacity ${
            !newService.name ||
            !newService.description ||
            !coverImagePreview ||
            (additionalImages.length + newAdditionalPreviews.length) > MAX_ADDITIONAL_IMAGES ||
            isLoading
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          aria-label="Salvar Serviço"
        >
          {isLoading
            ? "Salvando..."
            : editingService
            ? "Salvar Alterações"
            : "Adicionar Serviço"}
        </button>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center mb-6">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service._id}
            className="bg-gray-800 text-white p-6 rounded-lg shadow-lg flex flex-col"
          >
            <div className="relative h-48 w-full mb-4">
              <Image
                src={fallbackImages[`service-${service._id}`] ? "/default-image.png" : service.coverImageURL}
                alt={service.name}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
                onError={() => handleImageError(`service-${service._id}`)}
              />
            </div>
            <h3 className="text-lg font-bold">{service.name}</h3>
            <div className="flex mt-4 gap-2">
              <button
                onClick={() => handleEditService(service)}
                className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600"
                aria-label={`Editar serviço ${service.name}`}
              >
                Editar
              </button>
              <button
                onClick={() => handleDeleteService(service._id)}
                className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                aria-label={`Remover serviço ${service.name}`}
              >
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Renderização dos Toasts */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </main>
  );
};

export default AdminServicos;
