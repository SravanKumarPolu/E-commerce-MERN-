import React, { useContext } from 'react';

import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

// Define the props for the ProductItems component
interface ProductItemsProps {
  id: string;
  image: string[]; // Assuming image is an array of URLs
  name: string;
  price: number;
}

const ProductItems: React.FC<ProductItemsProps> = ({ id, image, name, price }) => {
  const context = useContext(ShopContext);

  // Check if context is undefined
  if (!context) {
    return null; // If context is not provided, return null
  }

  const { currency } = context;

  return (
    <Link to={`/product/${id}`} className='text-gray-700 cursor-pointer'>
      <div>
        <img className='hover:scale-110 transition ease-in-out' src={image[0]} alt={name} />
      </div>
      <p className='pt-3 pb-1 text-sm'>{name}</p>
      <p className='text-sm font-medium'>{currency}{price}</p>
    </Link>
  );
};

export default ProductItems;
