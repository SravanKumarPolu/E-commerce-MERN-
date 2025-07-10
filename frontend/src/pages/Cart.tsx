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
  const { products, currency, cartItems, updateQuantity, navigate } = useShopContext();
  const [cartData, setCartData] = useState<CartItem[]>([]);

  useEffect(() => {
    const tempData: CartItem[] = [];
    for (const itemId in cartItems) {
      for (const color in cartItems[itemId]) {
        if (cartItems[itemId][color] > 0) {
          tempData.push({
            _id: itemId,
            color,
            quantity: cartItems[itemId][color],
          });
        }
      }
    }
    setCartData(tempData);
  }, [cartItems]);

  return (
    <div className="border-t pt-14 min-h-screen px-4 sm:px-6 lg:px-8">
      {/* Section Title */}
      <div className="pb-8 text-center">
        <Title text1="Your Cart" text2="Items" />
      </div>

      {/* If cart is empty */}
      {cartData.length === 0 ? (
        <p className="text-center text-gray-500 text-lg mt-20">Your cart is empty.</p>
      ) : (
        <>
          {/* Cart Items */}
          <div className="max-w-5xl mx-auto space-y-6">
            {cartData.map((item) => {
              const productData = products.find((product) => product._id === item._id);

              return (
                <div
                  key={`${item._id}-${item.color}`}
                  className="flex gap-4 flex-col sm:flex-row items-center justify-between p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition"
                >
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-md object-cover"
                      src={productData?.image?.[0] || "/fallback.jpg"}
                      alt={productData?.name || "Cart item"}
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-col flex-grow px-4 text-gray-800">
                    <h3 className="font-semibold text-lg sm:text-xl">
                      {productData?.name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm mt-2">
                      <span className="text-gray-600">
                        <b>{currency}</b> {productData?.price}
                      </span>
                      <span className="px-3 py-1 border rounded-md bg-gray-100 text-gray-600 text-xs sm:text-sm">
                        {item.color}
                      </span>
                    </div>
                  </div>

                  {/* Quantity Input */}
                  <div className="flex items-center gap-3 mt-4 sm:mt-0">
                  <input
  type="number"
  min={1}
  value={item.quantity}
  onChange={(e) => {
    const val = Number(e.target.value);
    if (val > 0) {
      updateQuantity(item._id, item.color, val);
    }
  }}
  className="w-16 h-10 text-center cursor-pointer text-gray-800 bg-white border border-gray-300 rounded-md focus:ring focus:ring-indigo-200"
/>

                  </div>

                  {/* Remove Button */}
                  <div className="mt-4 sm:mt-0">
                    <button
                      onClick={() => updateQuantity(item._id, item.color, 0)}
                      aria-label="Remove item from cart"
                      className="p-2 rounded-full hover:bg-red-100 transition"
                    >
                      <img
                        className="w-5"
                        src={assets.bin_icon}
                        alt="Remove"
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart Total and Checkout */}
          <div className="flex justify-end my-20">
            <div className="w-full sm:w-[450px] space-y-6">
              <CartTotal />

              {/* Checkout Button */}
              <div className="text-end">
                <button
                  onClick={() => navigate("/place-order")}
                  disabled={cartData.length === 0}
                  aria-label="Proceed to Checkout"
                  className={`px-6 py-3 w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-lg rounded-lg shadow-lg transition-all duration-300 ease-in-out transform ${
                    cartData.length === 0
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:from-indigo-600 hover:to-blue-600 hover:scale-105"
                  }`}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
