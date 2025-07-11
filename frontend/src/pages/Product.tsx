import { useContext, useEffect, useState } from "react";
import RelatedProducts from "../components/RelatedProducts";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string[];
  category: string;
  subCategory: string;
  colors: string[];
  date: number;
  bestseller: boolean;
  rating?: number;
}

const Product: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { products, addToCart } = useContext(ShopContext) ?? { products: [], addToCart: () => { } };

  const [productData, setProductData] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"desc" | "reviews">("desc");

  useEffect(() => {
    if (products && productId) {
      const product = products.find((item: Product) => item._id === productId);
      if (product) {
        setProductData(product);
        setSelectedImage(product.image[0]);
        setSelectedColor("");
      }
    }
  }, [products, productId]);

  if (!productData) {
    return <div className="text-center py-10">Loading...</div>;
  }

  const handleSizeChange = (color: string) => {
    setSelectedColor(color);
  };

  const productRating = productData.rating ?? 4;

  return productData ? (
    <main className="border-t-2 pt-10 transition-opacity ease-in duration-500">
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
                  src={index < productRating ? assets.star_icon : assets.star_dull_icon}
                  alt={`Star ${index + 1}`}
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
              {productData.colors && productData.colors.length > 0 ? (
                productData.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleSizeChange(color)}
                    className={`px-4 py-2 border rounded-lg ${selectedColor === color
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    role="radio"
                    aria-checked={selectedColor === color}
                    tabIndex={0}
                    aria-label={`Select ${color} color`}
                  >
                    {color}
                  </button>
                ))
              ) : (
                <p>No colors available</p>
              )}
            </div>
          </div>

          <p className="text-sm text-gray-600">
            <span className="font-medium text-gray-800">Date Added:</span>{" "}
            {new Date(productData.date).toLocaleDateString()}
          </p>

          {/* Add to Cart Button */}
          <div className="mt-6">
            <button
              onClick={(e) => {
                e.preventDefault();
                if (!selectedColor) {
                  toast.error("Please select a color");
                  return;
                }
                addToCart(productData._id, selectedColor);
              }}
              disabled={!selectedColor}
              className={`w-full sm:w-auto text-white text-lg font-medium py-3 px-6 
                rounded-lg shadow transition duration-300 
                ${!selectedColor
                  ? "bg-blue-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"}`}
              aria-label="Add product to cart"
            >
              {selectedColor ? "Add to Cart" : "Select a Color First"}
            </button>
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
          <button
            className={`border px-5 py-3 text-sm ${activeTab === "desc" ? "bg-gray-100 font-medium" : ""}`}
            onClick={() => setActiveTab("desc")}
          >
            Description
          </button>
          <button
            className={`border px-5 py-3 text-sm ${activeTab === "reviews" ? "bg-gray-100 font-medium" : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews(111)
          </button>
        </div>
        <div className="mt-5 text-sm text-gray-700">
          {activeTab === "desc" ? productData.description : <p>No reviews yet.</p>}
        </div>
      </div>

      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
    </main>
  ) : <div className="opacity-0"></div>;
};

export default Product;