import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useShopContext } from "../context/ShopContext";
import CrossIcon from "./Icon";
import { assets } from "../assets/assets";

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } = useShopContext();
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setVisible(location.pathname.includes("collection"));
  }, [location]);

  if (!showSearch || !visible) return null;

  return (
    <div
      className="border-t border-b bg-gray-50 py-4 px-4 flex items-center justify-center gap-3"
      role="search"
      aria-label="Product Search Bar"
    >
      <div
        className="flex items-center border border-gray-300 bg-white rounded-lg w-full sm:w-2/3 md:w-1/2 lg:w-2/5 shadow-sm hover:shadow-md transition-shadow duration-300"
      >
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="flex-1 px-3 py-2 text-sm text-gray-700 bg-transparent outline-none placeholder-gray-400"
          aria-label="Search products"
          autoFocus
        />
        <img
          src={assets.search_icon}
          alt="Search Icon"
          className="w-4 h-4 mr-3 opacity-60"
        />
      </div>

      <button
        onClick={() => setShowSearch(false)}
        aria-label="Close Search Bar"
        className="text-gray-500 hover:text-red-600 transition duration-300 ease-in-out transform hover:scale-110"
      >
        <CrossIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default SearchBar;
