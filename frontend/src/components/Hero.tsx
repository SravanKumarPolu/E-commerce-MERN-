import { assets } from "../assets/assets"

const Hero = () => {
  return (
    <div className="flex flex-col sm:flex-row items-center border border-gray-300 rounded-lg shadow-lg overflow-hidden">

      {/* Hero left side */}
      <div className="w-full font-openSans sm:w-1/2 flex flex-col items-start justify-center px-8 py-10 bg-gradient-to-r from-gray-100 via-white to-gray-100">
        <div className="text-gray-800">
          {/* Bestseller Section */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-[2px] bg-gray-800"></div>
            <p className="font-medium text-sm md:text-base uppercase tracking-wider">
              Our Bestseller
            </p>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-montserrat  md:text-5xl font-bold text-gray-900 leading-tight mb-6">
            Latest Arrivals
          </h1>

          {/* CTA Section */}
          <div className="flex items-center gap-4">
            <button className=" font-workSans px-6 py-2 bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-700 transition duration-300">
              Shop Now
            </button>
            <p className="text-gray-600 font-medium text-sm md:text-base">
              Discover the trends
            </p>
          </div>
        </div>
      </div>

      {/* Hero right side */}
      <div className="w-full sm:w-1/2">
        <img
          src={assets.hero_img}
          alt="Hero"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  )
}

export default Hero
