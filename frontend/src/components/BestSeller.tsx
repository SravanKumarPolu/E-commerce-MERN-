import { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import { motion } from 'framer-motion';
import ProductItems from './ProductItems';
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string[]; // <-- this is an array
  category: string;
  subCategory: string;
  colors: string[];
  date: number;
  bestseller: boolean;
}

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
      setBestSeller(products.slice(0, 5));
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
