import { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import { motion } from 'framer-motion';
import ProductItems from './ProductItems';
import type { Product } from '../types';

const BestSeller: React.FC = () => {
  const context = useContext(ShopContext);

  if (!context) {
    return null;
  }
  
  const { products } = context;
  
  if (!products || products.length === 0) {
    return (
      <section className="py-12 text-center text-gray-500">
        Loading best sellers...
      </section>
    );
  }
  

  const [bestSeller, setBestSeller] = useState<Product[]>([]);



  useEffect(() => {
    if (products.length > 0) {
      // Filter products that are marked as bestsellers
      const bestsellerProducts = products.filter(product => product.bestseller === true);
      // Take up to 5 bestseller products
      setBestSeller(bestsellerProducts.slice(0, 5));
    }
  }, [products]);

  return (
    <section className="px-4 sm:px-6 md:px-8 lg:px-12
">
      {/* Section Title */}
      <header className="text-center mb-10">
  <Title text1="Best" text2="Seller" />
  <p className="w-3/4 mx-auto text-sm sm:text-base text-gray-500 mt-2">
    Discover our top-selling products loved by customers worldwide.
  </p>
</header>


      {/* Product Grid */}
      {bestSeller.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {bestSeller.map((item, index) => (
             <motion.div
             key={item._id}
             className="h-full min-h-[500px] flex"
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
               bestseller={item.bestseller}
             />
           </motion.div>
          ))}
        </div>
      ) : (
        <motion.div 
          className="text-center py-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-500 text-lg">No bestseller products available at the moment.</p>
          <p className="text-gray-400 text-sm mt-2">Check back soon for our featured products!</p>
        </motion.div>
      )}
    </section>
  );
};

export default BestSeller;
