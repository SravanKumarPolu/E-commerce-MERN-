import { assets } from "../assets/assets";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section
      className="flex flex-col sm:flex-row items-center border border-gray-200 rounded-2xl shadow-xl overflow-hidden bg-white font-openSans relative"
      aria-label="Hero Section"
    >
      {/* Optional Decorative SVG Background */}
      {/* <div
        className="absolute top-0 left-0 opacity-10 w-48 h-48 bg-no-repeat bg-contain"
        style={{ backgroundImage: `url('/pattern.svg')` }}
      /> */}

      {/* Left Side Content */}
      <motion.header
        className="w-full sm:w-1/2 px-6 sm:px-10 py-10 sm:py-14 bg-gradient-to-r from-gray-50 via-white to-gray-50"
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Badge */}
        <div className="flex items-center gap-3 mb-4 text-gray-800">
          <div className="w-8 h-[2px] bg-gray-800" />
          <p className="uppercase tracking-wider text-sm sm:text-base font-semibold">
            Our Bestseller
          </p>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-5xl font-bold font-montserrat text-gray-900 leading-tight mb-5 tracking-tight">
          Latest Arrivals
        </h1>

        {/* CTA Section */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
          <Link to="/shop">
            <button className="px-6 py-3 bg-gray-900 text-white rounded-lg shadow hover:shadow-lg hover:bg-gray-800 transition duration-300 font-semibold tracking-wide">
              Shop Now
            </button>
          </Link>
          <p className="text-gray-600 text-sm sm:text-base font-medium">
            Discover the trends
          </p>
        </div>
      </motion.header>

      {/* Right Side Video */}
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
          poster="/fallback.jpg"
          title="Hero promotional video showing latest arrivals"
        />
      </motion.div>
    </section>
  );
};

export default Hero;
