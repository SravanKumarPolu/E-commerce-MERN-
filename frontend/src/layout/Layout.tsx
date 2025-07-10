// src/layout/Layout.tsx
import React, { ReactNode } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import SearchBar from "../components/SearchBar";
import { ToastContainer } from "react-toastify";
 // make sure this exists
import "react-toastify/dist/ReactToastify.css";
import ScrollToTop from "./ScrollToTop";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="bg-white">
      {/* Utility components */}
      <ScrollToTop />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Global layout */}
      <NavBar />
      <SearchBar />
      
      <main
        role="main"
        className="px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 mx-auto py-6"
      >
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
