import { useContext, useEffect, useState } from "react";

import RelatedProducts from "../components/RelatedProducts";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import type { Product } from '../types';

const Product: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const context = useContext(ShopContext);
  
  // Ensure context is available
  if (!context) {
    return (
      <div className="text-center py-20">
        <p>Loading authentication...</p>
      </div>
    );
  }

  const { products, addToCart, isLoggedIn, navigate } = context;

  const [productData, setProductData] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");

  useEffect(() => {
    if (products && productId) {
      const product = products.find((item: Product) => item._id === productId);
      if (product) {
        setProductData(product);
        setSelectedImage(product.image[0]);
      }
    }
  }, [products, productId]);

  if (!productData) {
    return <div className="text-center py-10">Loading...</div>;
  }

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  };

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      toast.error("Please login to add items to cart");
      navigate('/login');
      return;
    }
    
    if (!selectedColor) {
      toast.error("Please select a color");
      return;
    }
    
    addToCart(productData._id, selectedColor);
  };


  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500">
      <div className="flex flex-col sm:flex-row gap-8">
        {/* Image Section */}
        <div className="flex-1 flex flex-col sm:flex-row gap-6">
          {/* Thumbnail Images */}
          <div
            className="flex sm:flex-col gap-3 sm:gap-4 overflow-x-auto sm:overflow-y-auto sm:w-[20%] w-full 
          sm:justify-start justify-between"
          >
            {productData.image.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumbnail ${index}`}
                className={`cursor-pointer rounded-lg shadow-sm w-[22%] sm:w-full flex-shrink-0 
                ${selectedImage === img ? "ring-2 ring-blue-500" : ""}`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>

          {/* Main Image */}
          <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={selectedImage}
              alt={productData.name}
              className="w-full h-auto max-h-[500px] object-contain"
            />
          </div>
        </div>

        {/* Product Details Section */}
        <div className="flex-1 flex flex-col justify-between">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {productData.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center font-medium gap-2 mb-4">
            <div className="flex items-center gap-1 mt-2">
              {[...Array(5)].map((_, index) => (
                <img
                  key={index}
                  src={assets.star_icon}
                  alt={`Star ${index}`}
                  className="w-3.5"
                />
              ))}
              <p className="pl-2">(111)</p>
            </div>
          </div>

          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            {productData.description}
          </p>
          <p className="text-xl font-semibold text-gray-900 mb-4">
            ${productData.price}
          </p>
          <p className="text-sm text-gray-600 mb-4">
            <span className="font-medium text-gray-800">Category:</span>{" "}
            {productData.category} / {productData.subCategory}
          </p>

          {/* Color Selection */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-800 mb-2 block">
              Select Color:
            </label>
            <div className="flex gap-3">
              {productData.color && productData.color.length > 0 ? (
                (() => {
                  // Debug: Log the raw color data
                  console.log('Raw color data:', productData.color);
                  console.log('Type of color data:', typeof productData.color);
                  
                  // Simple approach: convert to string and clean up
                  let colorString = '';
                  
                  if (Array.isArray(productData.color)) {
                    colorString = productData.color.join(',');
                  } else {
                    colorString = String(productData.color);
                  }
                  
                  // Clean up the string by removing ALL unwanted characters
                  const cleanedString = colorString
                    .replace(/[\[\]"'\\]/g, '') // Remove brackets, quotes, backslashes
                    .replace(/\s*,\s*/g, ',') // Normalize commas
                    .trim();
                  
                  // Split by comma and clean each color
                  const colors = cleanedString
                    .split(',')
                    .map((color: string) => color.trim())
                    .filter((color: string) => color.length > 0);
                  
                  console.log('Final colors:', colors);
                  
                  return colors.map((color: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => handleColorChange(color)}
                      className={`px-4 py-2 border rounded-lg transition-colors ${selectedColor === color
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300 border-gray-300"
                        }`}
                    >
                      {color}
                    </button>
                  ));
                })()
              ) : (
                <p className="text-gray-500">No colors available</p>
              )}
            </div>
          </div>


          <p className="text-sm text-gray-600">
            <span className="font-medium text-gray-800">Date Added:</span>{" "}
            {new Date(productData.date).toLocaleDateString()}
          </p>

          {/* Add to Cart Button */}
          <div className="mt-6">
            {!isLoggedIn ? (
              <div className="space-y-3">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="text-yellow-800 font-medium">Please login to add items to your cart</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full sm:w-auto bg-blue-600 text-white text-lg font-medium py-3 px-6 rounded-lg shadow hover:bg-blue-700 transition duration-300"
                >
                  Login to Shop
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                className={`w-full sm:w-auto bg-blue-600 text-white text-lg font-medium py-3 px-6 rounded-lg shadow hover:bg-blue-700 transition duration-300 ${
                  !selectedColor ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={!selectedColor}
              >
                {selectedColor ? "Add to Cart" : "Select a Color First"}
              </button>
            )}
          </div>
          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original product.</p>
            <p>Cash on delivery is also available on this product.</p>
            <p>Easy return</p>
          </div>
        </div>
      </div>

      {/* Description and Reviews */}
      <div className="mt-20">
        <div className="flex">
          <b className="border px-5 py-3 text-sm">Description</b>
          <p className="border px-5 py-3 text-sm">Reviews(111)</p>
        </div>
      </div>

      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
    </div>
  ) : <div className="opacity-0"></div>;
};

export default Product;
