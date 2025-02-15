import { assets } from "../assets/assets";
import { useShopContext } from "../context/ShopContext";

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } = useShopContext();
  return showSearch ? (
    <div className='border-t border-b bg-gray-50 text-center'>
      <div className='inline-flex items-center justify-center border border-gray-400 bg-white px-5 py-2 my-5 mx-3 rounded-md w-3/4 sm:w-1/2'>
        <input
          value={search} onChange={(e) => setSearch(e.target.value)}
          className='flex-1 outline-none bg-inherit text-sm'
          type='text'
          placeholder='Search...'
        />
        <img className='w-4'

          alt='Search Icon' src={assets.search_icon} />
      </div>
      <button

        aria-label="Close Search Bar"
        className="mt-2 text-gray-500 hover:text-red-600 transition duration-400"
      >
        <img
          onClick={() => setShowSearch(false)}
          src={assets.cross_icon}
          alt="Close Icon"
          className="inline-block w-4 h-4 cursor-pointer"
        />
      </button>
    </div>
  ) : null
};

export default SearchBar;