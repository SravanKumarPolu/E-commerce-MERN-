import { assets } from "../assets/assets";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const heroSlides = [
  { type: "image", src: assets.hero_1, alt: "Hero 1" },
  { type: "image", src: assets.hero_2, alt: "Hero 2" },
  { type: "image", src: assets.hero_3, alt: "Hero 3" },
  { type: "image", src: assets.hero_4, alt: "Hero 4" },
  { type: "image", src: assets.hero_5 || assets.hero_img, alt: "Hero Main" },
];

const AUTO_ADVANCE = 5000;

const Hero = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % heroSlides.length);
    }, AUTO_ADVANCE);
    return () => clearTimeout(timer);
  }, [index]);

  const goTo = (i: number) => {
    setDirection(i > index ? 1 : -1);
    setIndex(i);
  };

  const prev = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };
  const next = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % heroSlides.length);
  };

  return (
    <div className="relative flex flex-col sm:flex-row items-center border border-gray-200 rounded-2xl shadow-xl overflow-hidden bg-white font-openSans min-h-[400px]">
      {/* Left Section */}
      <motion.div
        className="w-full sm:w-1/2 px-8 py-12 bg-gradient-to-r from-gray-100 via-white to-gray-100 z-10"
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Badge */}
        <div className="flex items-center gap-3 mb-5 text-gray-800">
          <div className="w-10 h-[2px] bg-gray-800" />
          <p className="uppercase tracking-wide text-sm sm:text-base font-medium">Our Bestseller</p>
        </div>
        {/* Heading */}
        <h1 className="text-3xl sm:text-5xl font-bold font-montserrat text-gray-900 leading-tight mb-6">
          Latest Arrivals
        </h1>
        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button className="px-6 py-3 bg-gray-900 text-white rounded-lg shadow hover:shadow-lg hover:bg-gray-800 transition duration-300 font-semibold">
            Shop Now
          </button>
          <p className="text-gray-600 text-sm sm:text-base font-medium">
            Discover the trends
          </p>
        </div>
      </motion.div>
      {/* Right Section: Carousel */}
      <div className="w-full sm:w-1/2 h-[320px] sm:h-[420px] relative flex items-center justify-center bg-black">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={index}
            className="absolute w-full h-full flex items-center justify-center"
            initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
            transition={{ duration: 0.6 }}
          >
            {heroSlides[index].type === "image" ? (
              <img
                src={heroSlides[index].src}
                alt={heroSlides[index].alt}
                className="w-full h-full object-cover rounded-l-none rounded-r-2xl shadow-lg"
                draggable={false}
              />
            ) : null}
          </motion.div>
        </AnimatePresence>
        {/* Navigation Buttons */}
        <button
          aria-label="Previous slide"
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-2 shadow z-20"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button
          aria-label="Next slide"
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-2 shadow z-20"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
        </button>
        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              className={`w-3 h-3 rounded-full border-2 ${i === index ? "bg-blue-600 border-blue-600" : "bg-white border-gray-400"}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
