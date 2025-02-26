import { useEffect, useState } from "react";

import Title from "../components/Title";
import { assets } from "../assets/assets";
import { useShopContext } from "../context/ShopContext";

const Cart: React.FC = () => {
  const { products, currency, cartItems } = useShopContext();
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
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
    console.log(tempData)
    setCartData(tempData);
  }, [cartItems])
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

    </div>
  )
}

export default Cart