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
    <motion.div 
      className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl bg-gradient-to-br from-gray-50 to-white mx-4 sm:mx-6 lg:mx-8"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="flex flex-col lg:flex-row items-stretch min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]">
        {/* Left Section - Enhanced Content */}
        <motion.div
          className="w-full lg:w-1/2 px-6 sm:px-8 lg:px-12 py-8 sm:py-12 lg:py-16 flex flex-col justify-center relative z-10"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 w-96 h-96"></div>
          </div>

          {/* Badge with enhanced styling */}
          <motion.div 
            className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="w-8 sm:w-12 h-[2px] sm:h-[3px] bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" />
            <span className="uppercase tracking-wider text-xs sm:text-sm font-semibold text-gray-600 bg-gray-100 px-2 sm:px-3 py-1 rounded-full">
              Our Bestseller
            </span>
          </motion.div>

          {/* Enhanced Heading */}
          <motion.h1 
            className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight mb-4 sm:mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <span className="gradient-text">Latest</span>
            <br />
            <span className="text-gray-800">Arrivals</span>
          </motion.h1>

          {/* Enhanced Description */}
          <motion.p 
            className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-md"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
          >
            Discover the latest trends and innovations in technology. 
            Experience premium quality with cutting-edge design.
          </motion.p>

          {/* Enhanced CTA Section */}
          <motion.div 
            className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.button 
              className="btn-modern btn-primary px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Shop Now
            </motion.button>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm sm:text-base text-gray-600 font-medium">
                Discover the trends
              </p>
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div 
            className="flex items-center gap-4 sm:gap-8 mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-gray-900">10K+</div>
              <div className="text-xs sm:text-sm text-gray-600">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-gray-900">500+</div>
              <div className="text-xs sm:text-sm text-gray-600">Products</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-gray-900">24/7</div>
              <div className="text-xs sm:text-sm text-gray-600">Support</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Section: Enhanced Carousel */}
        <div className="w-full lg:w-1/2 h-[300px] sm:h-[400px] lg:h-auto relative overflow-hidden">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />
          
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={index}
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, x: direction > 0 ? 100 : -100, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: direction > 0 ? -100 : 100, scale: 0.95 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              {heroSlides[index].type === "image" ? (
                <div className="relative w-full h-full">
                  <img
                    src={heroSlides[index].src}
                    alt={heroSlides[index].alt}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                  {/* Overlay for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              ) : null}
            </motion.div>
          </AnimatePresence>

          {/* Enhanced Navigation Buttons */}
          <motion.button
            aria-label="Previous slide"
            onClick={prev}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 glass backdrop-blur-md bg-white/20 hover:bg-white/30 rounded-full p-2 sm:p-3 shadow-lg hover:shadow-xl transition-all duration-300 z-20"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg width="20" height="20" className="sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
          
          <motion.button
            aria-label="Next slide"
            onClick={next}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 glass backdrop-blur-md bg-white/20 hover:bg-white/30 rounded-full p-2 sm:p-3 shadow-lg hover:shadow-xl transition-all duration-300 z-20"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg width="20" height="20" className="sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>

          {/* Enhanced Indicators */}
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 z-20">
            {heroSlides.map((_, i) => (
              <motion.button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full border-2 transition-all duration-300 ${
                  i === index 
                    ? "bg-white border-white shadow-lg scale-125" 
                    : "bg-white/50 border-white/50 hover:bg-white/75"
                }`}
                onClick={() => goTo(i)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
              />
            ))}
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: AUTO_ADVANCE / 1000, ease: "linear" }}
              key={index}
            />
          </div>
        </div>
      </div>

      {/* Floating Elements for Visual Interest */}
      <div className="absolute top-8 sm:top-10 right-8 sm:right-10 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 blur-xl animate-bounce-gentle" />
      <div className="absolute bottom-16 sm:bottom-20 left-16 sm:left-20 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-20 blur-xl animate-bounce-gentle" style={{ animationDelay: '1s' }} />
    </motion.div>
  );
};

export default Hero;
