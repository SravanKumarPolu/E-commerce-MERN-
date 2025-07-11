import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useShopContext } from "../context/ShopContext";
import CrossIcon from "./Icon";
import { assets } from "../assets/assets";

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } = useShopContext();
  const [visible, setVisible] = useState(false);
  const [inputValue, setInputValue] = useState(search);
  const location = useLocation();

  // Show bar only on /collection route
  useEffect(() => {
    setVisible(location.pathname.includes("collection"));
  }, [location]);

  // Debounce input update
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(inputValue);
    }, 300);
    return () => clearTimeout(timer);
  }, [inputValue, setSearch]);

  // Keyboard shortcut: Ctrl + / or Cmd + /
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        setShowSearch(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setShowSearch]);

  // Scroll to top on open
  useEffect(() => {
    if (showSearch) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [showSearch]);

  if (!showSearch || !visible) return null;

  return (
    <div
      className="border-t border-b bg-gray-50 py-4 px-4 flex items-center justify-center gap-3 z-50"
      role="search"
      aria-label="Product Search Bar"
    >
      <div className="flex items-center border border-gray-300 bg-white rounded-lg w-full sm:w-2/3 md:w-1/2 lg:w-2/5 shadow-sm hover:shadow-md transition-shadow duration-300">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search products..."
          className="flex-1 px-3 py-2 text-sm text-gray-700 bg-transparent outline-none placeholder-gray-400"
          aria-label="Search products"
          autoFocus
        />
        {inputValue && (
          <button
            onClick={() => {
              setInputValue("");
              setSearch("");
            }}
            aria-label="Clear search"
            className="mr-1 text-gray-400 hover:text-black transition"
          >
            <CrossIcon className="w-4 h-4" />
          </button>
        )}
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
