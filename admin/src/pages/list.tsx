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
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id: string) => {
    try {
      setDeletingId(id);
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
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-heading-1 font-bold text-neutral-900 mb-2">Product Management</h1>
          <p className="text-body text-neutral-600">Manage all products in your store</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-caption text-neutral-500">
            {list.length} product{list.length !== 1 ? 's' : ''}
          </span>
          <button
            onClick={fetchList}
            className="btn-modern btn-secondary"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="card-modern p-12 text-center">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-heading-3 font-semibold text-neutral-900 mb-2">No Products Found</h3>
          <p className="text-body text-neutral-600 mb-6">Get started by adding your first product to the store.</p>
          <button className="btn-modern btn-primary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add Product</span>
          </button>
        </div>
      ) : (
        <div className="card-modern overflow-hidden">
          {/* Desktop Header */}
          <div className="hidden lg:grid grid-cols-[80px_2fr_1fr_1fr_100px] items-center py-4 px-6 bg-neutral-50 border-b border-neutral-200">
            <span className="text-caption font-semibold text-neutral-600">Image</span>
            <span className="text-caption font-semibold text-neutral-600">Product Name</span>
            <span className="text-caption font-semibold text-neutral-600">Category</span>
            <span className="text-caption font-semibold text-neutral-600">Price</span>
            <span className="text-caption font-semibold text-neutral-600 text-center">Actions</span>
          </div>

          {/* Product List */}
          <div className="divide-y divide-neutral-200">
            {list.map((item) => (
              <div
                key={item._id}
                className="grid grid-cols-1 lg:grid-cols-[80px_2fr_1fr_1fr_100px] items-center p-4 lg:p-6 hover:bg-neutral-50 transition-smooth"
              >
                {/* Mobile Layout */}
                <div className="lg:hidden flex items-center gap-4 mb-4">
                  <img 
                    src={item.image[0]} 
                    alt={item.name} 
                    className="w-16 h-16 object-cover rounded-lg border border-neutral-200" 
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-neutral-900 mb-1">{item.name}</h3>
                    <p className="text-body-small text-neutral-600 mb-2">{item.category}</p>
                    <p className="text-heading-4 font-bold text-primary-600">
                      {currency}{item.price.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeProduct(item._id)}
                    disabled={deletingId === item._id}
                    className="p-2 text-error-500 hover:text-error-600 hover:bg-error-50 rounded-lg transition-smooth disabled:opacity-50"
                    aria-label="Delete product"
                  >
                    {deletingId === item._id ? (
                      <div className="loading-spinner w-5 h-5"></div>
                    ) : (
                      <DeleteIcon />
                    )}
                  </button>
                </div>

                {/* Desktop Layout */}
                <div className="hidden lg:flex items-center">
                  <img 
                    src={item.image[0]} 
                    alt={item.name} 
                    className="w-12 h-12 object-cover rounded-lg border border-neutral-200" 
                  />
                </div>
                
                <div className="hidden lg:block">
                  <h3 className="font-semibold text-neutral-900">{item.name}</h3>
                </div>
                
                <div className="hidden lg:block">
                  <span className="badge badge-info">{item.category}</span>
                </div>
                
                <div className="hidden lg:block">
                  <p className="text-heading-4 font-bold text-primary-600">
                    {currency}{item.price.toFixed(2)}
                  </p>
                </div>
                
                <div className="hidden lg:flex justify-center">
                  <button
                    onClick={() => removeProduct(item._id)}
                    disabled={deletingId === item._id}
                    className="p-2 text-error-500 hover:text-error-600 hover:bg-error-50 rounded-lg transition-smooth disabled:opacity-50"
                    aria-label="Delete product"
                  >
                    {deletingId === item._id ? (
                      <div className="loading-spinner w-5 h-5"></div>
                    ) : (
                      <DeleteIcon />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
