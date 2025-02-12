
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

  return (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500">
      products
    </div>
  );
};

export default Product;
