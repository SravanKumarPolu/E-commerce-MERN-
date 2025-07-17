// src/layout/Layout.tsx
import React, { ReactNode } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import SearchBar from "../components/SearchBar";
import { ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import { ScrollToTopButton } from "../utils/ScrollToTop";
import PerformanceMonitor from "../components/PerformanceMonitor";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Navigation */}
      <NavBar />
      
      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="rounded-lg shadow-lg"
      />
      
      {/* Search Bar */}
      <SearchBar />
      
      {/* Main Content */}
      <motion.main 
        className="flex-1 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-br from-green-400/10 to-blue-600/10 rounded-full blur-3xl"></div>
        </div>
        
        {/* Content Container */}
        <div className="relative z-10">
          {children}
        </div>
      </motion.main>
      
      {/* Scroll to Top Button */}
      <ScrollToTopButton />
      
      {/* Performance Monitor (Development Only) */}
      <PerformanceMonitor />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
