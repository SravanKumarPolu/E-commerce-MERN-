import { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import ProductItems from './ProductItems';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../types';

const LatestCollection: React.FC = () => {
  const context = useContext(ShopContext);
  const navigate = useNavigate();

  if (!context) {
    return (
      <section className="section-padding text-center text-gray-500">
        No latest products available.
      </section>
    );
  }

  const { products, refreshProducts } = context;
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (products.length > 0) {
      setLatestProducts(products.slice(0, 8));
    }
  }, [products]);

  return (
    <div className="space-y-12">
      {/* Section Header */}
      <motion.div
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-[3px] bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" />
          <span className="uppercase tracking-wider text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            New Arrivals
          </span>
          <div className="w-12 h-[3px] bg-gradient-to-r from-purple-600 to-blue-600 rounded-full" />
        </div>
        
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 font-display">
          Latest <span className="gradient-text">Collection</span>
        </h2>
        
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-body">
          Discover our newest arrivals featuring cutting-edge technology and innovative design. 
          Stay ahead with the latest trends in premium electronics.
        </p>

        <motion.button
          onClick={refreshProducts}
          className="btn-modern btn-secondary px-6 py-3 text-base font-semibold rounded-xl mt-4"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Refresh Products
        </motion.button>
      </motion.div>

      {/* Products Grid */}
      {latestProducts.length === 0 ? (
        <motion.p 
          className="text-center text-gray-500 text-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          No new products found.
        </motion.p>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {latestProducts.map((item, index) => (
            <motion.div
              key={item._id}
              className="h-full min-h-[500px] flex"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ProductItems
                id={item._id}
                image={item.image}
                name={item.name}
                price={item.price}
                bestseller={item.bestseller}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* View All Button */}
      <motion.div
        className="text-center pt-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
      >
        <motion.button
          onClick={() => navigate('/collection')}
          className="btn-modern btn-outline px-8 py-4 text-lg font-semibold rounded-2xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          View All Products
        </motion.button>
      </motion.div>
    </div>
  );
};

export default LatestCollection;
