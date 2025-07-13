import { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItems from './ProductItems';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../types';

const LatestCollection: React.FC = () => {
  const context = useContext(ShopContext);
  const navigate = useNavigate();

  if (!context) {
    return (
      <section className="py-16 px-4 text-center text-gray-500">
        No latest products available.
      </section>
    );
  }

  const { products } = context;
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (products.length > 0) {
      setLatestProducts(products.slice(0, 10));
    }
  }, [products]);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <Title text1="Latest" text2="Collection" />
        <p className="w-full sm:w-3/4 lg:w-2/3 mx-auto text-sm sm:text-base text-gray-500 mt-2 leading-relaxed">
          Check out our freshest drops—hand-picked just for you!
        </p>
      </div>

      {latestProducts.length === 0 ? (
        <p className="text-center text-gray-500">No new products found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {latestProducts.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <ProductItems
                id={item._id}
                image={item.image}
                name={item.name}
                price={item.price}
              />
            </motion.div>
          ))}
        </div>
      )}

      <div className="text-center mt-12">
        <button
          onClick={() => navigate('/collection')}
          className="px-6 py-2 border border-gray-800 text-gray-800 rounded-md hover:bg-gray-100 transition duration-300 font-medium"
        >
          View All Products
        </button>
      </div>
    </section>
  );
};

export default LatestCollection;
