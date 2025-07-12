import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { assets } from '../assets/assets';
import { useShopContext } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';

const NavBar = () => {
  const [visible, setVisible] = useState(false);
  const { setShowSearch, getCartCount } = useShopContext();
  const { isAuthenticated, user, logout } = useAuth();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Collection', path: '/collection' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" aria-label="Go to homepage">
            <img src={assets.logo} className="w-10" alt="Logo" />
          </Link>

          {/* Desktop Tabs */}
          <div role="tablist" className="tabs tabs-lifted hidden sm:flex text-sm text-black font-semibold">
            <NavLink
              to="/"
              role="tab"
              className={({ isActive }) =>
                `tab flex-col items-center gap-1 ${isActive ? 'tab-active bg-clip-text text-transparent bg-gradient-to-r from-gray-600 to-yellow-500' : 'text-black font-semibold'}`
              }
            >
              <p>Home</p>
            </NavLink>

            <NavLink
              to="/collection"
              role="tab"
              className={({ isActive }) =>
                `tab flex-col items-center gap-1 ${isActive ? 'tab-active bg-clip-text text-transparent bg-gradient-to-r from-gray-600 to-yellow-500' : 'text-black font-semibold'}`
              }
            >
              <p>Collection</p>
            </NavLink>
            
            <NavLink
              to="/about"
              role="tab"
              className={({ isActive }) =>
                `tab flex-col items-center gap-1 ${isActive ? 'tab-active bg-clip-text text-transparent bg-gradient-to-r from-gray-600 to-yellow-500' : 'text-black font-semibold'}`
              }
            >
              <p>About</p>
            </NavLink>
            
            <NavLink
              to="/contact"
              role="tab"
              className={({ isActive }) =>
                `tab flex-col items-center gap-1 ${isActive ? 'tab-active bg-clip-text text-transparent bg-gradient-to-r from-gray-600 to-yellow-500' : 'text-black font-semibold'}`
              }
            >
              <p>Contact</p>
            </NavLink>
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
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2 cursor-pointer">
                    <img
                      src={assets.profile_icon}
                      className="w-6 cursor-pointer"
                      alt="Profile"
                      aria-label="Profile"
                    />
                    <span className="hidden sm:block text-sm font-medium text-gray-700">
                      {user?.name}
                    </span>
                  </div>
                  <div className="absolute right-0 pt-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto z-40">
                    <div className="flex flex-col gap-2 w-36 px-5 py-3 bg-white shadow-md text-gray-600 rounded text-sm">
                      <Link to="/profile" className="cursor-pointer hover:text-black">
                        My Profile
                      </Link>
                      <Link to="/orders" className="cursor-pointer hover:text-black">
                        Orders
                      </Link>
                      {!user?.isEmailVerified && (
                        <div className="text-xs text-orange-600 border-t pt-2">
                          Email not verified
                        </div>
                      )}
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
                    alt="Profile"
                    aria-label="Profile"
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

            {/* User Info in Mobile */}
            {isAuthenticated && (
              <div className="p-4 border-b">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
                {!user?.isEmailVerified && (
                  <p className="text-xs text-orange-600 mt-1">Email not verified</p>
                )}
              </div>
            )}

            {navLinks.map((nav) => (
              <NavLink
                key={nav.path}
                to={nav.path}
                onClick={() => setVisible(false)}
                className={({ isActive }) =>
                  `py-3 px-6 border-b text-sm font-medium ${
                    isActive ? 'text-black font-semibold' : 'text-gray-600'
                  }`
                }
              >
                {nav.label}
              </NavLink>
            ))}

            {/* Mobile Auth Links */}
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setVisible(false)}
                  className="py-3 px-6 border-b text-sm font-medium text-gray-600"
                >
                  My Profile
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setVisible(false)}
                  className="py-3 px-6 border-b text-sm font-medium text-gray-600"
                >
                  Orders
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setVisible(false);
                  }}
                  className="py-3 px-6 border-b text-sm font-medium text-gray-600 text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setVisible(false)}
                className="py-3 px-6 border-b text-sm font-medium text-gray-600"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default NavBar;
