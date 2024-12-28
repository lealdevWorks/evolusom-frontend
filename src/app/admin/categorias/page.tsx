"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type Category = {
  _id: string;
  name: string;
  image: string;
};

const Categorias = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState<{ name: string; image: string | null }>({
    name: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/categories");
      if (!response.ok) throw new Error("Erro ao buscar categorias.");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCategory((prev) => ({ ...prev, image: reader.result as string }));
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.name || !newCategory.image) {
      alert("Preencha todos os campos e envie uma imagem.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:5000/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategory),
      });

      if (!response.ok) throw new Error("Erro ao criar categoria.");

      const createdCategory = await response.json();
      alert("Categoria criada com sucesso!");

      // Atualiza a lista de categorias
      setCategories((prev) => [...prev, createdCategory]);
      setNewCategory({ name: "", image: null });
      setImagePreview(null);
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
      alert("Erro ao criar categoria.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const confirmation = confirm(
        "A exclusão desta categoria também removerá todos os álbuns associados. Deseja continuar?"
      );
      if (!confirmation) return;

      const response = await fetch(`http://localhost:5000/api/categories/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro ao excluir categoria.");

      // Atualiza a lista de categorias após exclusão
      setCategories((prev) => prev.filter((category) => category._id !== id));
      alert("Categoria e conteúdo associado excluídos com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
      alert("Erro ao excluir categoria e conteúdo associado.");
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-20 py-10">
      <h1 className="text-3xl font-bold text-white mb-6 text-center">
        Gerenciar Categorias
      </h1>

      <div className="bg-gray-800 p-6 rounded-lg text-white shadow-lg max-w-4xl mx-auto">
        {/* Formulário para criar categoria */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Nome da Categoria"
              value={newCategory.name}
              onChange={(e) => setNewCategory((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full p-3 rounded bg-gray-700 text-white"
            />
          </div>
          <div className="flex-1">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full p-3 bg-gray-700 text-white"
            />
          </div>
          <div className="sm:w-auto">
            <button
              onClick={handleAddCategory}
              className="w-full bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-transform transform hover:scale-105 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Salvando..." : "Adicionar"}
            </button>
          </div>
        </div>

        {/* Preview da Imagem */}
        {imagePreview && (
          <div className="flex justify-center mb-4">
            <Image
              src={imagePreview}
              alt="Pré-visualização da imagem"
              width={128}
              height={128}
              className="object-cover rounded-full shadow-lg"
            />
          </div>
        )}

        {/* Lista de Categorias */}
        <ul className="space-y-4">
          {categories.map((category) => (
            <li
              key={category._id}
              className="flex justify-between items-center bg-gray-700 p-3 rounded shadow"
            >
              <div className="flex items-center gap-4">
                <Image
                  src={category.image}
                  alt={category.name}
                  width={48}
                  height={48}
                  className="object-cover rounded-full shadow-md"
                />
                <span className="text-sm sm:text-base">{category.name}</span>
              </div>
              <button
                onClick={() => handleDeleteCategory(category._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-transform transform hover:scale-105"
              >
                Excluir
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Categorias;
