import { useContext, useEffect, useState } from "react";

import { ShopContext } from "../context/ShopContext";
import { useParams } from "react-router-dom";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string[];
  category: string;
  subCategory: string;
  size: string[];
  date: number;
  bestseller: boolean;
  rating?: number;
}

const Product: React.FC = () => {
  const { productId } = useParams();
  const { products } = useContext(ShopContext)
  const [productData, setProductData] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const filterProductsData = async () => {
    products.map((item) => {
      if (item.id === productId) {
        setProductData(item)
        setImage(item.image[0])
        console.log()
        return null
      }
    })
  }
  useEffect(() => {
    filterProductsData()
  }, [productId])

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500">
      products
    </div>
  ) : <div className="opacity-0"></div>;
};

export default Product;
