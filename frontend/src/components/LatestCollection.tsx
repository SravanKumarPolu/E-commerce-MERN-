import { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import ProductItems from './ProductItems';
import Title from './Title';
import { motion } from 'framer-motion';

const LatestCollection = () => {
  const context = useContext(ShopContext);

  if (!context) {
    return (
      <section className="py-12 text-center text-gray-500">
        No latest products available.
      </section>
    );
  }

  const { products } = context;
  const [latestProducts, setLatestProducts] = useState<typeof products>([]);

  useEffect(() => {
    if (products.length > 0) {
      setLatestProducts(products.slice(0, 10));
    }
  }, [products]);

  return (
    <section className="py-16">
      {/* Section Title */}
      <div className="text-center mb-10">
        <Title text1="Latest" text2="Collection" />
        <p className="w-3/4 mx-auto text-sm sm:text-base text-gray-500 mt-2">
          Check out our freshest drops—hand-picked just for you!
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 px-4">
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
    </section>
  );
};

export default LatestCollection;
