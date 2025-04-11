import { backendUrl, currency } from "../App";
import { useEffect, useState } from "react";
import DeleteIcon from "../assets/DeleteIcon";
import axios from "axios";
import { toast } from "react-toastify";

interface ListProps {
  token: string;
}

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  image: string[];
}

const List: React.FC<ListProps> = ({ token }) => {
  const [list, setList] = useState<Product[]>([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong!");
    }
  };

  const removeProduct = async (id: string) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/product/remove`,
        { id },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      toast.error(error?.message || "An unexpected error occurred");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">All Products List</h2>

      {/* Desktop Layout */}
      <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-3 px-4 bg-gray-100 border rounded-md text-sm font-semibold text-gray-600">
        <span>Image</span>
        <span>Name</span>
        <span>Category</span>
        <span>Price</span>
        <span className="text-center">Action</span>
      </div>

      <div className="flex flex-col gap-2 mt-2">
        {list.map((item) => (
          <div
            key={item._id}
            className="grid grid-cols-1 md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center border rounded-md p-3 md:p-2 text-sm gap-y-2 md:gap-0 hover:shadow-md transition"
          >
            {/* Mobile Label */}
            <div className="md:hidden flex items-center gap-4">
              <img src={item.image[0]} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-xs text-gray-500">{item.category}</p>
                <p className="text-sm font-semibold mt-1">
                  {currency} {item.price}
                </p>
              </div>
              <button
                onClick={() => removeProduct(item._id)}
                className="ml-auto text-red-500 hover:text-red-600 transition"
                aria-label="Delete product"
              >
                <DeleteIcon />
              </button>
            </div>

            {/* Desktop Layout */}
            <img src={item.image[0]} alt={item.name} className="hidden md:block w-14 h-14 object-cover rounded" />
            <p className="hidden md:block">{item.name}</p>
            <p className="hidden md:block">{item.category}</p>
            <p className="hidden md:block">
              {currency} {item.price}
            </p>
            <div className="hidden md:flex justify-center">
              <button
                onClick={() => removeProduct(item._id)}
                className="text-red-500 hover:text-red-600 cursor-pointer transition text-lg"
                aria-label="Delete product"
              >
                <DeleteIcon />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
