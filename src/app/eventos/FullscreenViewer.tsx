   // frontend/src/app/eventos/FullscreenViewer.tsx
   
   "use client";
   
   import { useEffect, useState, useRef, KeyboardEvent as ReactKeyboardEvent } from "react";
   import Image from "next/image";
   import { FaTimes } from "react-icons/fa"; // Ícone de fechar
   
   export interface FullscreenViewerProps {
     image: string;
     images: string[];
     onClose: () => void;
   }
   
   const FullscreenViewer: React.FC<FullscreenViewerProps> = ({ image, images, onClose }) => {
     const [currentIndex, setCurrentIndex] = useState<number>(() => {
       const index = images.indexOf(image);
       return index !== -1 ? index : 0;
     });
   
     const containerRef = useRef<HTMLDivElement>(null);
   
     const handleNext = () => {
       setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
     };
   
     const handlePrev = () => {
       setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
     };
   
     const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
       if (event.key === "Escape") {
         onClose();
       } else if (event.key === "ArrowRight") {
         handleNext();
       } else if (event.key === "ArrowLeft") {
         handlePrev();
       }
     };
   
     useEffect(() => {
       // Focar no container para capturar eventos de teclado
       containerRef.current?.focus();
     }, []);
   
     return (
       <div
         id="fullscreen-viewer-container"
         ref={containerRef}
         className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center outline-none"
         tabIndex={0} // Permite que o div receba foco
         onKeyDown={handleKeyDown}
         role="dialog"
         aria-modal="true"
         aria-label="Visualizador de Imagens em Tela Cheia"
       >
         {/* Botão de Fechar */}
         <button
           onClick={onClose}
           className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
           aria-label="Fechar visualizador"
         >
           <FaTimes size={20} />
         </button>
   
         {/* Botão Anterior */}
         <button
           onClick={handlePrev}
           className="absolute left-4 bg-gray-700 bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-gray-500"
           aria-label="Imagem anterior"
         >
           &#8592;
         </button>
   
         {/* Imagem Principal */}
         <div className="relative">
           <Image
             src={images[currentIndex]}
             alt={`Imagem ${currentIndex + 1} de ${images.length}`}
             width={800}
             height={600}
             className="max-w-full max-h-screen object-contain"
           />
           <p className="text-white text-center mt-2">
             {currentIndex + 1} / {images.length}
           </p>
         </div>
   
         {/* Botão Próximo */}
         <button
           onClick={handleNext}
           className="absolute right-4 bg-gray-700 bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-gray-500"
           aria-label="Próxima imagem"
         >
           &#8594;
         </button>
       </div>
     );
   };
   
   export default FullscreenViewer;
