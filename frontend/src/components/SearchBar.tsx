import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useShopContext } from '../context/ShopContext';
import { useDebounce } from '../hooks/useDebounce';

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } = useShopContext();
  const [localSearch, setLocalSearch] = useState(search);
  const debouncedSearch = useDebounce(localSearch, 300); // 300ms delay
  const location = useLocation();

  // Update the context search when debounced value changes
  useEffect(() => {
    setSearch(debouncedSearch);
  }, [debouncedSearch, setSearch]);

  // Hide search bar when not on collection page
  useEffect(() => {
    if (location.pathname !== '/collection') {
      setShowSearch(false);
    }
  }, [location.pathname, setShowSearch]);

  // Sync local search with context search
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  if (!showSearch) {
    return null;
  }

  return (
    <div className="border-t border-b bg-gray-50 text-center">
      <div className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2">
        <input
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="flex-1 outline-none bg-inherit text-sm"
          type="text"
          placeholder="Search products..."
          aria-label="Search products"
        />
        <img 
          className="w-4" 
          src={assets.search_icon} 
          alt="Search icon" 
        />
      </div>
      <img
        onClick={() => setShowSearch(false)}
        className="inline w-3 cursor-pointer"
        src={assets.cross_icon}
        alt="Close search"
        aria-label="Close search"
      />
    </div>
  );
};

export default SearchBar;
