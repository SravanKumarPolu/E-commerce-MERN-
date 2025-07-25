import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ShoppingBag, Info, Mail } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/collection', label: 'Shop', icon: ShoppingBag },
  { path: '/about', label: 'About', icon: Info },
  { path: '/contact', label: 'Contact', icon: Mail },
];

const MobileBottomNav = () => {
  const location = useLocation();

  return (
    <motion.div
      className="fixed bottom-4 left-1/2 z-50 sm:hidden"
      style={{ width: "calc(100% - 2rem)" }}
      initial={{ y: 100, x: "-50%", opacity: 0 }}
      animate={{ y: 0, x: "-50%", opacity: 1 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
    >
      <nav
        className="relative"
        role="navigation"
        aria-label="Mobile Bottom Navigation"
        tabIndex={0}
      >
        {/* Floating background with glass morphism effect and dark mode support */}
        <motion.div
          className="absolute inset-0 bg-white/80 dark:bg-black/40 backdrop-blur-lg dark:backdrop-blur-md rounded-xl shadow-lg border border-gray-100 dark:border-gray-800"
          layoutId="nav-background"
        />

        <div className="relative flex items-center justify-evenly p-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex-1 flex items-center justify-center min-w-0 relative z-10"
                aria-current={isActive ? "page" : undefined}
                aria-label={item.label}
              >
                <motion.div
                  className={`flex flex-col items-center justify-center gap-1 px-3 py-2 w-full rounded-lg ${
                    isActive
                      ? 'text-white'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Active indicator background */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-400 dark:from-blue-600 dark:to-blue-500 rounded-lg shadow-blue-500/20"
                      layoutId="active-item"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}

                  <Icon className="w-5 h-5 relative z-10" />
                  <span className="text-xs font-medium relative z-10">
                    {item.label}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>
    </motion.div>
  );
};

export default MobileBottomNav;
