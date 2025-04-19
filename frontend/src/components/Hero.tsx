import { assets } from "../assets/assets";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <div className="flex flex-col sm:flex-row items-center border border-gray-200 rounded-2xl shadow-xl overflow-hidden bg-white font-openSans">
      
      {/* Left Section */}
      <motion.div
        className="w-full sm:w-1/2 px-8 py-12 bg-gradient-to-r from-gray-100 via-white to-gray-100"
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

      {/* Right Section: Hero Video */}
      <motion.div
        className="w-full sm:w-1/2 h-full"
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <video
          src={assets.hero_1}
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          poster="/fallback.jpg" // Add a fallback image in assets
        />
      </motion.div>
    </div>
  );
};

export default Hero;
