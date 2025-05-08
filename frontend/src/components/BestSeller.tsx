import { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import { motion } from 'framer-motion';
import ProductItems from './ProductItems';

const BestSeller: React.FC = () => {
  const context = useContext(ShopContext);

  if (!context || !context.products) {
    return (
      <section className="py-12 text-center text-gray-500">
        No best sellers available at the moment.
      </section>
    );
  }

  const { products } = context;
  const [bestSeller, setBestSeller] = useState<typeof products>([]);

  useEffect(() => {
    if (products.length > 0) {
      setBestSeller(products.slice(0, 5));
    }
  }, [products]);

  return (
    <section className="py-4">
      {/* Section Title */}
      <div className="text-center mb-10">
        <Title text1="Best" text2="Seller" />
        <p className="w-3/4 mx-auto text-sm sm:text-base text-gray-500 mt-2">
          Discover our top-selling products loved by customers worldwide.
        </p>
      </div>

      {/* Product Grid */}
      <div className=" grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 px-4">
        {bestSeller.map((item, index) => (
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
    </section>
  );
};

export default BestSeller;
