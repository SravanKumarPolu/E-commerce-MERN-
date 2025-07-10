import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProductItems from './ProductItems';
import Title from './Title';
import { ShopContext } from '../context/ShopContext';

interface RelatedProductsProps {
  category: string;
  subCategory: string;
  maxItems?: number;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string[];
  category: string;
  subCategory: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  category,
  subCategory,
  maxItems = 5,
}) => {
  const { products } = useContext(ShopContext) || { products: [] as Product[] };
  const [related, setRelated] = useState<Product[]>([]);

  useEffect(() => {
    const filtered = products.filter(
      (item) => item.category === category && item.subCategory === subCategory
    );
    setRelated(filtered.slice(0, maxItems));
  }, [category, subCategory, products, maxItems]);

  return (
    <section className="my-24 px-4 sm:px-6 lg:px-8" aria-labelledby="related-products-title">
      <div>
        <Title text1="RELATED" text2="PRODUCTS" />
      </div>

      {related.length === 0 ? (
        <p className="text-center text-gray-500 mt-6 text-sm sm:text-base">
          No related products found.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-8 mt-8">
          {related.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <ProductItems
                id={item._id}
                name={item.name}
                price={item.price}
                image={item.image}
              />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};

export default RelatedProducts;
