// src/layout/Layout.tsx
import React, { ReactNode } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import SearchBar from "../components/SearchBar";
import { ToastContainer } from "react-toastify";

interface LayoutProps {
  children: ReactNode;
}


const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
  <div className="bg-white px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12  mx-auto ">
      <NavBar />
      <ToastContainer />
      <SearchBar />
      <main className=" ">
        {children}
      </main>
      <Footer />
      </div>
    </>
  );
};

export default Layout;
