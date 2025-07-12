import { useEffect, useState } from "react";
import CartTotal from "../components/CartTotal";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import { useShopContext } from "../context/ShopContext";
import { useAuth } from "../context/AuthContext";

const Cart: React.FC = () => {
  const { products, currency, cartItems, updateQuantity, navigate, loading, getProductById } = useShopContext();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="border-t pt-14 min-h-screen px-4 sm:px-6 lg:px-8">
      {/* Section Title */}
      <div className="pb-8 text-center">
        <Title text1="Your Cart" text2="Items" />
      </div>

      {/* If cart is empty */}
      {cartItems.length === 0 ? (
        <div className="text-center mt-20">
          <p className="text-gray-500 text-lg mb-6">Your cart is empty.</p>
          <button
            onClick={() => navigate('/collection')}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="max-w-5xl mx-auto space-y-6">
            {cartItems.map((item) => {
              const productData = getProductById(item.productId);

              if (!productData) return null;

              return (
                <div
                  key={`${item._id}`}
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
                      {item.size && (
                        <span className="px-3 py-1 border rounded-md bg-gray-100 text-gray-600 text-xs sm:text-sm">
                          Size: {item.size}
                        </span>
                      )}
                      {item.color && (
                        <span className="px-3 py-1 border rounded-md bg-gray-100 text-gray-600 text-xs sm:text-sm">
                          Color: {item.color}
                        </span>
                      )}
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
                          updateQuantity(item.productId, val, item.size, item.color);
                        }
                      }}
                      className="w-16 h-10 text-center cursor-pointer text-gray-800 bg-white border border-gray-300 rounded-md focus:ring focus:ring-indigo-200"
                    />
                  </div>

                  {/* Remove Button */}
                  <div className="mt-4 sm:mt-0">
                    <button
                      onClick={() => updateQuantity(item.productId, 0, item.size, item.color)}
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
                  disabled={cartItems.length === 0}
                  aria-label="Proceed to Checkout"
                  className={`px-6 py-3 w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-lg rounded-lg shadow-lg transition-all duration-300 ease-in-out transform ${
                    cartItems.length === 0
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
