import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useShopContext } from '../context/ShopContext';

const MobileBottomNav = () => {
  const location = useLocation();
  const { getCartCount, isLoggedIn } = useShopContext();

  const navItems = [
    {
      path: '/',
      label: 'Home',
      icon: '🏠',
      activeIcon: '🏠'
    },
    {
      path: '/collection',
      label: 'Shop',
      icon: '🛍️',
      activeIcon: '🛍️'
    },
    {
      path: '/cart',
      label: 'Cart',
      icon: '🛒',
      activeIcon: '🛒',
      badge: getCartCount()
    },
    {
      path: isLoggedIn ? '/profile' : '/login',
      label: isLoggedIn ? 'Profile' : 'Login',
      icon: isLoggedIn ? '👤' : '🔑',
      activeIcon: isLoggedIn ? '👤' : '🔑'
    }
  ];

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-50 sm:hidden"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
    >
      {/* Background with blur effect */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-xl border-t border-gray-200" />
      
      {/* Navigation items */}
      <div className="relative flex items-center justify-around px-4 py-3">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center justify-center min-w-0 flex-1"
            >
              <motion.div
                className={`relative p-3 rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-blue-100 text-blue-600 shadow-lg' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Icon */}
                <div className="text-2xl mb-1">
                  {isActive ? item.activeIcon : item.icon}
                </div>
                
                {/* Badge for cart */}
                {item.badge && item.badge > 0 && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    {item.badge > 99 ? '99+' : item.badge}
                  </motion.div>
                )}
              </motion.div>
              
              {/* Label */}
              <span className={`text-xs font-medium mt-1 ${
                isActive ? 'text-blue-600' : 'text-gray-500'
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
      
      {/* Safe area for devices with home indicator */}
      <div className="h-safe-area-inset-bottom bg-white/80 backdrop-blur-xl" />
    </motion.div>
  );
};

export default MobileBottomNav; 