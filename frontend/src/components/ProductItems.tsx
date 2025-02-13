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
    <Link to={`/product/${id}`} className="group block">
      <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300">
        <figure className="overflow-hidden">
          <img
            src={image[0]}
            alt={name}
            className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </figure>
        <div className="card-body p-4 text-center">
          <h3 className="text-md font-semibold group-hover:text-accent">{name}</h3>
          <p className="text-sm text-gray-500 font-medium">{currency}{price}</p>
      </div>
      </div>
    </Link>
  );
};

export default ProductItems;
