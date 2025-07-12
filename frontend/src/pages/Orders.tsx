import { useEffect, useState } from "react";
import Title from "../components/Title";
import { useShopContext } from "../context/ShopContext";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { Order } from "../utils/api";

const Orders: React.FC = () => {
  const { currency, getUserOrders, getProductById, navigate } = useShopContext();
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const userOrders = await getUserOrders();
        setOrders(userOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, navigate, getUserOrders]);

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="border-t pt-16 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="text-2xl">
        <Title text1="MY" text2="ORDERS" />
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-base sm:text-lg mb-6">
            You have no orders yet.
          </p>
          <button
            onClick={() => navigate('/collection')}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition"
            >
              {/* Order Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Order #{order._id.slice(-8)}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Placed on {new Date(order.createdAt).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">
                    {currency}{order.amount}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span 
                      className={`w-3 h-3 rounded-full ${
                        order.status === 'Delivered' ? 'bg-green-500' :
                        order.status === 'Shipped' || order.status === 'Out for delivery' ? 'bg-blue-500' :
                        order.status === 'Cancelled' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}
                    />
                    <p className="text-sm font-medium text-gray-700">{order.status}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3">
                {order.items.map((item, index) => {
                  const productData = getProductById(item.productId);
                  
                  if (!productData) return null;
                  
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                    >
                      <img
                        className="w-16 h-16 rounded-lg object-cover"
                        src={productData.image[0]}
                        alt={productData.name}
                      />
                      <div className="flex-grow">
                        <h4 className="font-medium text-gray-900">{productData.name}</h4>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mt-1">
                          <span className="font-medium">{currency}{productData.price}</span>
                          <span>Qty: {item.quantity}</span>
                          {item.size && <span>Size: {item.size}</span>}
                          {item.color && <span>Color: {item.color}</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Actions */}
              <div className="flex justify-between items-center mt-6 pt-4 border-t">
                <div className="text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Payment:</span> {order.payment ? 'Paid' : 'Pending'}
                  </p>
                  <p>
                    <span className="font-medium">Method:</span> {order.paymentMethod || 'N/A'}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Link
                    to={`/order/${order._id}`}
                    className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition"
                  >
                    View Details
                  </Link>
                  {order.status === 'Order Placed' && (
                    <button
                      onClick={() => {
                        // Add cancel order functionality here
                        console.log('Cancel order:', order._id);
                      }}
                      className="px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;