import { useContext, useEffect, useState } from 'react'

import ProductItems from './ProductItems';
import { ShopContext } from '../context/ShopContext'
import Title from './Title';

const LatestCollection = () => {
  const context = useContext(ShopContext);

  if (!context) {
    return <div>No products available</div>;
  }

  const { products } = context;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [latestProducts, setLatestProducts] = useState<typeof products>([])

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (products && products.length > 0) {
      setLatestProducts(products.slice(0, 10));
    }
  }, [products]);
  return (
    <div>   <div className='text-center py-8 text-3xl'>
      <Title text1="Latest" text2="Collection" />
      <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
        {/* You can add a subtitle or description here */}
      </p>
    </div>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {latestProducts.map((item) => (
          <ProductItems key={item._id} id={item._id} image={item.image} name={item.name} price={item.price} />
        ))}
      </div>
    </div>
  )
}

export default LatestCollection