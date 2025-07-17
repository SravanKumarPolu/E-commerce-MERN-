import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { motion } from 'framer-motion';

interface ProductItemsProps {
  id: string;
  image: string[];
  name: string;
  price: number;
}

const ProductItems: React.FC<ProductItemsProps> = ({ id, image, name, price }) => {
  const context = useContext(ShopContext);

  if (!context) return null;

  const { currency } = context;

  return (
    <Link
      to={`/product/${id}`}
      className="group block focus:outline-none h-full"
      aria-label={`View details for ${name}`}
    >
      <motion.div 
        className="card-modern h-full flex flex-col bg-white group"
        whileHover={{ y: -8 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {/* Product Image Container */}
        <div className="relative overflow-hidden aspect-square w-full bg-gray-50">
          <motion.img
            src={image[0]}
            alt={name || 'Product image'}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.7 }}
          />
          
          {/* Overlay with quick actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500 flex items-center justify-center">
            <motion.div
              className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500"
              initial={{ opacity: 0, y: 20 }}
              whileHover={{ opacity: 1, y: 0 }}
            >
              <div className="flex gap-3">
                <motion.button
                  className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all duration-300"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Quick view"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </motion.button>
                
                <motion.button
                  className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all duration-300"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Add to wishlist"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Badge for new products */}
          <div className="absolute top-3 left-3">
            <span className="badge badge-primary shadow-md">
              New
            </span>
          </div>

          {/* Rating stars */}
          <div className="absolute top-3 right-3 flex items-center gap-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-white text-xs font-medium bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">4.8</span>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-3 flex-1 flex flex-col">
          {/* Product Name */}
          <h3 className="text-base font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2 leading-tight flex-1 font-display">
            {name}
          </h3>
          
          {/* Price with enhanced styling */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900">
                {currency}{price}
              </span>
              <span className="text-sm text-gray-500 line-through">
                {currency}{Math.round(price * 1.2)}
              </span>
            </div>
            
            {/* Discount badge */}
            <span className="badge badge-success">
              -20%
            </span>
          </div>

          {/* Color options */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 font-medium">Colors:</span>
            <div className="flex gap-2">
              <div className="w-4 h-4 bg-black rounded-full border-2 border-white shadow-md ring-1 ring-gray-200"></div>
              <div className="w-4 h-4 bg-gray-400 rounded-full border-2 border-white shadow-md ring-1 ring-gray-200"></div>
              <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md ring-1 ring-gray-200"></div>
            </div>
          </div>

          {/* Quick add to cart button */}
          <motion.button
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 text-sm mt-auto"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.preventDefault();
              // Add to cart functionality would go here
            }}
          >
            Add to Cart
          </motion.button>

          {/* Stock status */}
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-600 font-medium">In Stock</span>
            <span className="text-gray-500">• Free Shipping</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductItems;
