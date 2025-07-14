import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { assets } from '../assets/assets';
import { useShopContext } from '../context/ShopContext';
import { navLinks, userMenuLinks } from '../constants/navigation';

const NavBar = () => {
  const [visible, setVisible] = useState(false);
  const { setShowSearch, getCartCount, isLoggedIn, logoutUser } = useShopContext();

  const handleLogout = () => {
    logoutUser();
    setVisible(false);
  };

  return (
    <>
      <div className="font-outfit flex items-center justify-between py-5 font-medium relative z-50 px-4">
        {/* Logo */}
        <Link to="/" aria-label="Go to homepage">
          <img src={assets.logo} className="w-10" alt="Logo" />
        </Link>

        {/* Desktop Tabs */}
        <div role="tablist" className="tabs tabs-lifted hidden sm:flex text-sm text-gray-900">
          {navLinks.map((navItem) => (
            <NavLink
              key={navItem.path}
              to={navItem.path}
              role="tab"
              className={({ isActive }) =>
                `tab flex-col items-center gap-1 ${
                  isActive 
                    ? 'tab-active bg-clip-text text-transparent bg-gradient-to-r from-gray-600 to-yellow-500' 
                    : ''
                }`
              }
            >
              <p>{navItem.label}</p>
            </NavLink>
          ))}
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-6">
          {/* Search */}
          <img
            onClick={() => setShowSearch(true)}
            src={assets.search_icon}
            className="w-6 cursor-pointer"
            alt="Search"
            aria-label="Search"
          />

          {/* Profile Dropdown */}
          <div className="relative group">
            {isLoggedIn ? (
              <>
                <img
                  src={assets.profile_icon}
                  className="w-6 cursor-pointer"
                  alt="Profile"
                  aria-label="Profile"
                />
                <div className="absolute right-0 pt-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto z-40">
                  <div className="flex flex-col gap-2 w-36 px-5 py-3 bg-white shadow-md text-gray-600 rounded text-sm">
                    {userMenuLinks.map((link) => (
                      <Link 
                        key={link.path}
                        to={link.path} 
                        className="cursor-pointer hover:text-black"
                      >
                        {link.label}
                      </Link>
                    ))}
                    <button 
                      onClick={handleLogout}
                      className="cursor-pointer hover:text-black text-left"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <Link to="/login">
                <img
                  src={assets.profile_icon}
                  className="w-6 cursor-pointer"
                  alt="Login"
                  aria-label="Login"
                />
              </Link>
            )}
          </div>

          {/* Cart */}
          <Link to="/cart" className="relative" aria-label="Cart">
            <img src={assets.cart_icon} alt="Cart" className="w-6 cursor-pointer" />
            <span className="absolute -right-1 -bottom-1 w-4 h-4 text-center bg-black text-white text-[10px] rounded-full flex items-center justify-center">
              {getCartCount()}
            </span>
          </Link>

          {/* Mobile Menu Icon */}
          <img
            onClick={() => setVisible(true)}
            src={assets.menu_icon}
            alt="Menu"
            className="w-6 cursor-pointer sm:hidden"
            aria-label="Open menu"
          />
        </div>
      </div>

      {/* Backdrop */}
      {visible && (
        <div
          onClick={() => setVisible(false)}
          className="fixed inset-0 bg-black/40 z-40 sm:hidden"
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-3/4 max-w-xs bg-white z-50 transition-transform duration-300 ease-in-out sm:hidden ${
          visible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full text-gray-700">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-3 p-4 cursor-pointer border-b"
          >
            <img src={assets.dropdown_icon} alt="Back" className="h-4" />
            <p>Back</p>
          </div>

          {navLinks.map((navItem) => (
            <NavLink
              key={navItem.path}
              to={navItem.path}
              onClick={() => setVisible(false)}
              className={({ isActive }) =>
                `py-3 px-6 border-b text-sm font-medium ${
                  isActive ? 'text-black font-semibold' : 'text-gray-600'
                }`
              }
            >
              {navItem.label}
            </NavLink>
          ))}

          {/* Mobile Authentication Section */}
          <div className="border-t mt-auto">
            {isLoggedIn ? (
              <div className="flex flex-col">
                {userMenuLinks.map((link) => (
                  <Link 
                    key={link.path}
                    to={link.path} 
                    onClick={() => setVisible(false)}
                    className="py-3 px-6 text-sm font-medium text-gray-600 hover:text-black"
                  >
                    {link.label}
                  </Link>
                ))}
                <button 
                  onClick={handleLogout}
                  className="py-3 px-6 text-sm font-medium text-gray-600 hover:text-black text-left"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                onClick={() => setVisible(false)}
                className="py-3 px-6 text-sm font-medium text-gray-600 hover:text-black block"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
