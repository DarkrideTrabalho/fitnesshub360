import { useEffect, useState } from "react";

const useCarousel = (images: string[], interval: number = 5000) => {
  const [activeSlide, setActiveSlide] = useState(0);

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const slideInterval = setInterval(nextSlide, interval);
    return () => clearInterval(slideInterval);
  }, [interval]);

  return { activeSlide, nextSlide, prevSlide };
};

export default useCarousel;