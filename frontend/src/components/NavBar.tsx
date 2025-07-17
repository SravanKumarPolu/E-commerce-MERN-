import { Link, NavLink } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { assets } from '../assets/assets';
import { useShopContext } from '../context/ShopContext';
import { navLinks, userMenuLinks } from '../constants/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const NavBar = () => {
  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const { setShowSearch, getCartCount, isLoggedIn, logoutUser } = useShopContext();
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };

    if (showProfileDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileDropdown]);

  const handleLogout = () => {
    logoutUser();
    setVisible(false);
    setShowProfileDropdown(false);
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  return (
    <>
      <motion.nav 
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'glass backdrop-blur-md bg-white/90 shadow-lg' 
            : 'bg-white border-b border-gray-100'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="font-outfit flex items-center justify-between py-3 px-4 sm:py-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Logo with enhanced animation */}
          <Link to="/" aria-label="Go to homepage" className="group">
            <motion.img 
              src={assets.logo} 
              className="w-8 sm:w-10 transition-transform duration-300 group-hover:scale-110" 
              alt="Logo"
              whileHover={{ rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            />
          </Link>

          {/* Desktop Navigation with enhanced styling */}
          <div role="tablist" className="tabs tabs-lifted hidden sm:flex text-sm text-gray-900">
            {navLinks.map((navItem, index) => (
              <motion.div
                key={navItem.path}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <NavLink
                  to={navItem.path}
                  role="tab"
                  className={({ isActive }) =>
                    `tab flex-col items-center gap-1 px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-all duration-300 ${
                      isActive 
                        ? 'tab-active bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                        : 'hover:bg-gray-100 hover:scale-105'
                    }`
                  }
                >
                  <p className="font-medium text-sm sm:text-base">{navItem.label}</p>
                </NavLink>
              </motion.div>
            ))}
          </div>

          {/* Right Icons with enhanced interactions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search with enhanced animation */}
            <motion.button
              onClick={() => setShowSearch(true)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Search"
            >
              <img
                src={assets.search_icon}
                className="w-4 h-4 sm:w-5 sm:h-5"
                alt="Search"
              />
            </motion.button>

            {/* Profile Dropdown with enhanced UX */}
            <div className="relative" ref={profileDropdownRef}>
              {isLoggedIn ? (
                <>
                  <motion.button
                    onClick={toggleProfileDropdown}
                    className={`p-2 rounded-full transition-colors duration-200 ${
                      showProfileDropdown ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Profile"
                    aria-expanded={showProfileDropdown}
                  >
                    <img
                      src={assets.profile_icon}
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      alt="Profile"
                    />
                  </motion.button>
                  
                  <AnimatePresence>
                    {showProfileDropdown && (
                      <motion.div 
                        className="absolute right-0 pt-2 sm:pt-4 z-40"
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="glass backdrop-blur-md bg-white/95 shadow-xl rounded-xl p-2 min-w-[160px] border border-gray-200">
                          {userMenuLinks.map((link, index) => (
                            <motion.div
                              key={link.path}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <Link 
                                to={link.path} 
                                onClick={() => setShowProfileDropdown(false)}
                                className="block px-3 sm:px-4 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                              >
                                {link.label}
                              </Link>
                            </motion.div>
                          ))}
                          <hr className="my-2 border-gray-200" />
                          <motion.button 
                            onClick={handleLogout}
                            className="w-full text-left px-3 sm:px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                            whileHover={{ x: 5 }}
                          >
                            Logout
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link to="/login">
                  <motion.button
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Login"
                  >
                    <img
                      src={assets.profile_icon}
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      alt="Login"
                    />
                  </motion.button>
                </Link>
              )}
            </div>

            {/* Cart with enhanced badge */}
            <Link to="/cart" className="relative group" aria-label="Cart">
              <motion.div
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <img src={assets.cart_icon} alt="Cart" className="w-4 h-4 sm:w-5 sm:h-5" />
                <AnimatePresence>
                  {getCartCount() > 0 && (
                    <motion.span 
                      className="absolute -right-1 -top-1 w-4 h-4 sm:w-5 sm:h-5 text-center bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-semibold shadow-lg"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      key={getCartCount()}
                    >
                      {getCartCount()}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>

            {/* Mobile Menu Icon with enhanced animation */}
            <motion.button
              onClick={() => setVisible(true)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 sm:hidden"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Open menu"
            >
              <img
                src={assets.menu_icon}
                alt="Menu"
                className="w-4 h-4 sm:w-5 sm:h-5"
              />
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Enhanced Backdrop */}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setVisible(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 sm:hidden"
          />
        )}
      </AnimatePresence>

      {/* Enhanced Mobile Sidebar */}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 sm:hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Menu</h2>
                <motion.button
                  onClick={() => setVisible(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Close menu"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 overflow-y-auto py-4">
                {navLinks.map((navItem, index) => (
                  <motion.div
                    key={navItem.path}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <NavLink
                      to={navItem.path}
                      onClick={() => setVisible(false)}
                      className={({ isActive }) =>
                        `block px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg font-medium transition-all duration-200 ${
                          isActive 
                            ? 'text-blue-600 bg-blue-50 border-r-4 border-blue-600' 
                            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                        }`
                      }
                    >
                      {navItem.label}
                    </NavLink>
                  </motion.div>
                ))}
              </div>

              {/* Authentication Section */}
              <div className="border-t border-gray-200 p-4 sm:p-6">
                {isLoggedIn ? (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 mb-4">Account</p>
                    {userMenuLinks.map((link, index) => (
                      <motion.div
                        key={link.path}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link 
                          to={link.path} 
                          onClick={() => setVisible(false)}
                          className="block px-3 sm:px-4 py-2 sm:py-3 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    ))}
                    <motion.button 
                      onClick={handleLogout}
                      className="w-full text-left px-3 sm:px-4 py-2 sm:py-3 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                      whileHover={{ x: 5 }}
                    >
                      Logout
                    </motion.button>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Link 
                      to="/login" 
                      onClick={() => setVisible(false)}
                      className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Login
                    </Link>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavBar;
