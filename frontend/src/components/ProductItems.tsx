import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

interface ProductItemsProps {
  id: string;
  image: string[];
  name: string;
  price: number;
}

const ProductItems: React.FC<ProductItemsProps> = ({ id, image, name, price }) => {
  const context = useContext(ShopContext);

  if (!context) return null;

  const { currency } = context;

  return (
    <Link
      to={`/product/${id}`}
      className="group block focus:outline-none"
      aria-label={`View details for ${name}`}
    >
      <div className="card bg-white shadow-md rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
        {/* Product Image */}
        <figure className="relative overflow-hidden h-40 sm:h-44 md:h-48 lg:h-52">
          <img
            src={image[0]}
            alt={name || 'Product image'}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
        </figure>

        {/* Product Info */}
        <div className="card-body p-4 text-center">
          <h3 className="text-md font-semibold text-gray-800 group-hover:text-accent line-clamp-1">
            {name}
          </h3>
          <p className="text-sm text-gray-500 font-medium">
            {currency}
            {price}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductItems;
