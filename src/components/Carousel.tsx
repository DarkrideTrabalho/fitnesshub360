// Carousel.tsx
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useCarousel from "../hooks/useCarousel"; // Importando o hook

interface CarouselImage {
  url: string;
  title: string;
  description: string;
}

interface CarouselProps {
  images: CarouselImage[];
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const { activeSlide, nextSlide, prevSlide, setActiveSlide } = useCarousel(
    images.map((img) => img.url)
  );

  return (
    <section className="relative h-[70vh] bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden">
      {/* Carrossel de Imagens */}
      <div className="absolute inset-0 z-0">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === activeSlide ? "opacity-70" : "opacity-0"
            }`}
          >
            <img
              src={image.url}
              alt={image.title}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Overlay com texto */}
      <div className="absolute inset-0 z-10 flex items-center">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white max-w-3xl mx-auto"
          >
            Gestão da sua academia de forma simples e eficiente
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-xl text-slate-200 max-w-2xl mx-auto"
          >
            Plataforma completa para administradores, professores e alunos, tudo
            em um só lugar.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10"
          >
            <Button size="lg">Começar agora</Button>
          </motion.div>
        </div>
      </div>

      {/* Controles do carrossel */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Indicadores do carrossel */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === activeSlide ? "bg-white" : "bg-white/40"
            }`}
            onClick={() => setActiveSlide(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default Carousel;
