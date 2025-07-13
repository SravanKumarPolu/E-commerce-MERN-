import { useEffect, useState } from "react";

import CartTotal from "../components/CartTotal";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import { useShopContext } from "../context/ShopContext";

interface CartItem {
  _id: string;
  color: string;
  quantity: number;
}
const Cart: React.FC = () => {
  const { products, currency, cartItems, updateQuantity, navigate, isLoggedIn } = useShopContext();
  const [cartData, setCartData] = useState<CartItem[]>([]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (!isLoggedIn) return; // Don't process cart if not logged in
    
    const tempData = [];
    for (const itemId in cartItems) {
      for (const color in cartItems[itemId]) {
        if (cartItems[itemId][color] > 0) {
          tempData.push({
            _id: itemId,
            color: color,
            quantity: cartItems[itemId][color],
          });
        }
      }
    }
    setCartData(tempData);
  }, [cartItems, isLoggedIn]);

  // Show loading or redirect message if not logged in
  if (!isLoggedIn) {
    return (
      <div className="border-t pt-14 min-h-screen">
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold mb-4">Please Login</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your cart.</p>
          <button 
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="border-t pt-14  min-h-screen">
      <div className="pb-8 text-center">
        <Title text1="Your Cart" text2="Items" />
      </div>
      <div className="max-w-5xl mx-auto space-y-6">
        {cartData.map((item, index) => {
          const productData = products.find((product) => product._id === item._id);

          return (
            <div
              key={index}
              className="flex gap-1 flex-col sm:flex-row items-center justify-between p-4   rounded-lg border border-gray-200"
            >
              {/* Product Image */}
              <div className="flex-shrink-0">
                <img
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-md object-cover"
                  src={productData?.image[0]}
                  alt={productData?.name}
                />
              </div>

              {/* Product Details */}
              <div className="flex flex-col flex-grow px-4 text-gray-800">
                <p className="font-semibold text-lg sm:text-xl">{productData?.name}</p>
                <div className="flex items-center gap-4 text-sm mt-2">
                  <p className="text-gray-600">
                    <span className="font-bold">{currency}</span>
                    {productData?.price}
                  </p>
                  <p className="px-3 py-1 border rounded-md bg-gray-100 text-gray-600 text-xs sm:text-sm">
                    {item.color}
                  </p>
                </div>
              </div>

              {/* Quantity Control */}
              <div className="flex items-center gap-3 mt-4 sm:mt-0">
                <input
                  onChange={(e) => e.target.value === "" || e.target.value === "0" ? null : updateQuantity(item._id, item.color, Number(e.target.value))}
                  className="w-16 h-10 text-center text-gray-700 border border-gray-300 rounded-md focus:ring "
                  type="number"
                  min={1}
                  defaultValue={item.quantity}
                />
              </div>

              {/* Remove Icon */}
              <div className="mt-4 sm:mt-0">
                <button
                  onClick={() => updateQuantity(item._id, item.color, 0)}
                  className="p-2 rounded-full  text-white"
                >
                  <img className="w-5" src={assets.bin_icon} alt="Remove" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div className='flex justify-end my-20'>
        <div className='w-full sm:w-[450px]'>
          <CartTotal />
          {/* Checkout Button */}
          <div className="mt-10 text-end">
            <button
              onClick={() => navigate('/place-order')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-lg rounded-lg shadow-lg hover:from-indigo-600 hover:to-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Cart