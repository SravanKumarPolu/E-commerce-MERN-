import { useContext, useEffect, useState } from 'react';

import { ShopContext } from '../context/ShopContext';
import Title from './Title';

const BestSeller: React.FC = () => {
  const context = useContext(ShopContext);

  if (!context || !context.products) {
    return <div>No products available</div>;
  }

  const { products } = context;


  const { currency } = context;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [bestSeller, setBestSeller] = useState<typeof products>([])

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (products && products.length > 0) {
      setBestSeller(products.slice(0, 5));
    }
  }, [products]);

  return (
    <section className="py-12">
      {/* Section Title */}
      <div className="text-center">
        <Title text1="Best" text2="Seller" />
        <p className="w-3/4 mx-auto text-sm sm:text-base text-gray-500 mt-2">
          Discover our top-selling products loved by customers worldwide.
        </p>
      </div>

      {/* Product Grid */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {bestSeller.map((item) => (
          <div
            key={item._id}
            className="group block card bg-base-100 shadow-md cursor-pointer"
          >
            {/* Product Image */}
            <figure className="overflow-hidden">
              <img
                src={item.image[0]}
                alt={item.name}
                className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
              />
            </figure>

            {/* Product Details */}
            <div className="card-body p-4 text-center">
              <h3 className="text-md font-semibold text-gray-700 group-hover:text-accent">{item.name}</h3>
              <p className="text-sm text-gray-500 font-medium">{currency}{item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

  );
};

export default BestSeller;
