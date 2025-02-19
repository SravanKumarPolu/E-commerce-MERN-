import { useEffect, useState } from "react";

import CrossIcon from "./Icon";
import { assets } from "../assets/assets";
import { useLocation } from "react-router-dom";
import { useShopContext } from "../context/ShopContext";

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } = useShopContext();
  const [visible, setVisible] = useState(false);
  const location = useLocation();
  useEffect(() => {
    if (location.pathname.includes('collection')) {
      setVisible(true)
    }
    else {
      setVisible(false)
    }
  }, [location])
  return showSearch && visible ? (
    <div className='border-t border-b bg-gray-50 text-center flex items-center justify-center'>
      <div className="inline-flex items-center justify-center border border-gray-300 bg-white px-4 py-2 my-4 mx-3 rounded-lg w-3/4
       sm:w-1/2 shadow-sm hover:shadow-md transition-shadow duration-300">
        <input
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="flex-1 outline-none bg-inherit text-sm text-gray-700 placeholder-gray-400"
          type='text'
          placeholder='Search...'
        />
        <img
          className="w-4 h-4 ml-2 text-gray-500"
          alt='Search Icon' src={assets.search_icon} />
      </div>
      <button
        onClick={() => setShowSearch(false)}
        aria-label="Close Search Bar"
        className=" text-gray-500 hover:text-red-600 transition duration-300 ease-in-out transform hover:scale-110"

      >
        <CrossIcon className="inline-block w-5 h-5 cursor-pointer" />
      </button>
    </div>
  ) : null
};

export default SearchBar;