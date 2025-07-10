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

  // Fallback for symbol-based currency values
  const currencyMap: Record<string, string> = {
    "$": "USD",
    "₹": "INR",
    "€": "EUR",
    "£": "GBP",
  };

  const validCurrency = currencyMap[currency] || currency || "USD";

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: validCurrency,
  }).format(price);

  return (
    <Link
      to={`/product/${id}`}
      className="group block focus:outline-none"
      aria-label={`View details for ${name}`}
    >
      <article className="card bg-white shadow-md rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl">
        {/* Product Image */}
        <figure className="relative overflow-hidden h-44 sm:h-48 md:h-52 lg:h-56">
          <img
            src={image?.[0] || '/fallback.jpg'}
            alt={name || 'Product image'}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
        </figure>

        {/* Product Info */}
        <div className="card-body px-4 py-5 text-center">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 group-hover:text-accent group-hover:underline transition-all duration-200 line-clamp-1">
            {name}
          </h3>
          <p className="text-sm sm:text-base text-gray-500 font-medium mt-1">
            {formattedPrice}
          </p>
        </div>
      </article>
    </Link>
  );
};

export default ProductItems;
