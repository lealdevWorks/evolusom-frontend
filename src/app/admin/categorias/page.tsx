"use client";

import { useState, useEffect } from "react";

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
      if (!confirm("Deseja excluir esta categoria?")) return;

      const response = await fetch(`http://localhost:5000/api/categories/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro ao excluir categoria.");

      // Atualiza a lista de categorias após exclusão
      setCategories((prev) => prev.filter((category) => category._id !== id));
      alert("Categoria excluída com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
      alert("Erro ao excluir categoria.");
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-white mb-6 text-center">
        Gerenciar Categorias
      </h1>

      <div className="bg-gray-800 p-6 rounded-lg text-white max-w-4xl mx-auto shadow-lg">
        {/* Formulário para criar/editar categoria */}
        <div className="flex gap-4 items-center mb-6">
          <input
            type="text"
            placeholder="Nome da Categoria"
            value={newCategory.name}
            onChange={(e) => setNewCategory((prev) => ({ ...prev, name: e.target.value }))}
            className="flex-1 p-2 rounded bg-gray-700 text-white"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="flex-1 p-2 bg-gray-700 text-white"
          />
          <button
            onClick={handleAddCategory}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-transform transform hover:scale-105"
            disabled={isLoading}
          >
            {isLoading ? "Salvando..." : "Adicionar"}
          </button>
        </div>

        {/* Preview da Imagem */}
        {imagePreview && (
          <div className="flex justify-center mb-4">
            <img
              src={imagePreview}
              alt="Pré-visualização da imagem"
              className="w-32 h-32 object-cover rounded-full shadow-lg"
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
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-12 h-12 object-cover rounded-full shadow-md"
                />
                <span>{category.name}</span>
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
