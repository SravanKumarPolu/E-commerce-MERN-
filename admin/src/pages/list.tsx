import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import DeleteIcon from "../assets/DeleteIcon";
import { backendUrl, currency } from "../App";

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
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Something went wrong!");
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
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Unexpected error occurred");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
  // Keep the same logic from above, only replace the table render part:

<div className="mt-6">
  <h2 className="text-xl font-semibold mb-4">All Products List</h2>

  <div className="overflow-x-auto rounded-md border border-gray-200 shadow">
    <table className="min-w-full text-sm text-left">
      <thead className="bg-gray-100 text-gray-600 uppercase tracking-wider">
        <tr>
          <th className="px-4 py-2">Image</th>
          <th className="px-4 py-2">Name</th>
          <th className="px-4 py-2">Category</th>
          <th className="px-4 py-2">Price</th>
          <th className="px-4 py-2 text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        {list.map((item) => (
          <tr
            key={item._id}
            className="border-t hover:bg-gray-50 transition duration-150"
          >
            <td className="px-4 py-2">
              <img src={item.image[0]} alt={item.name} className="w-12 h-12 object-cover rounded" />
            </td>
            <td className="px-4 py-2">{item.name}</td>
            <td className="px-4 py-2">{item.category}</td>
            <td className="px-4 py-2">
              {currency} {item.price}
            </td>
            <td className="px-4 py-2 text-center">
              <button
                onClick={() => removeProduct(item._id)}
                className="text-red-600 hover:text-red-800"
              >
                <DeleteIcon className="w-5 h-5" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    {list.length === 0 && (
      <p className="text-center py-4 text-gray-500">No products found.</p>
    )}
  </div>
</div>

  );
};

export default List;
