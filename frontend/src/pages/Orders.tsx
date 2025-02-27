import Title from "../components/Title";
import { useShopContext } from "../context/ShopContext";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string[];
}

const Orders: React.FC = () => {
  const { products, currency } = useShopContext();

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1="MY  " text2="ORDERS" />
      </div>
      <div>
        {products.slice(1, 4).map((item, index) => (
          <div
            key={index}
            className="py-4 border-t text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            {/* Product Details */}
            <div className="flex items-start gap-6">
              <img
                className="w-20 h-20 rounded-lg object-cover"
                src={item.image[0]}
                alt={item.name}
              />
              <div>
                <p className="text-lg font-semibold text-gray-900">{item.name}</p>
                <div className="flex items-center gap-4 text-gray-700 mt-2 text-sm">
                  <p className="font-medium">
                    {currency}
                    {item.price}
                  </p>
                  <p>Quantity: 1</p>
                  <p>Size: Blue</p>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Date: <span className="text-gray-400">28, Feb, 2025</span>
                </p>
              </div>


            </div>
            {/* Order Status and Action */}
            <div className="flex items-center justify-between md:justify-end gap-6 mt-4 md:mt-0 md:w-1/3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <p className="text-sm font-medium text-gray-700">Ready to ship</p>
              </div>
              <button

                className="border px-4 py-2 text-sm font-medium rounded-sm"
              >
                Track Order
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Orders;
