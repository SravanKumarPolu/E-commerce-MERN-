import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";

import Add from "./pages/add";
import List from "./pages/list";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Orders from "./pages/orders";
import Dashboard from "./pages/dashboard";
import SalesAnalytics from "./pages/salesAnalytics";
import ProductAnalytics from "./pages/productAnalytics";
import UserAnalytics from "./pages/userAnalytics";
import SearchAnalytics from "./pages/searchAnalytics";
import Sidebar from "./components/Sidebar";
import { ToastContainer } from "react-toastify";

export const backendUrl: string = import.meta.env.VITE_BACKEND_URL;
export const currency = '$'
const App = () => {
  const [token, setToken] = useState<string>(localStorage.getItem("token") || "");

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);
  return (
    <div className="min-h-screen bg-gray-50 text-gray-700">
      <ToastContainer />
      {token === '' ? (<Login setToken={setToken} />) : (<>
        {/* Sticky Navbar */}
        <Navbar setToken={setToken} />

        {/* Main layout */}
        <div className="flex">
          {/* Sidebar */}
          <Sidebar />

          {/* Content */}
          <main className="flex-1 px-6 py-8 md:ml-0">
            <div className="max-w-5xl mx-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/add" element={<Add token={token} />} />
                <Route path="/list" element={<List token={token} />} />
                <Route path="/orders" element={<Orders token={token} />} />
                <Route path="/analytics/sales" element={<SalesAnalytics />} />
                <Route path="/analytics/products" element={<ProductAnalytics />} />
                <Route path="/analytics/users" element={<UserAnalytics />} />
                <Route path="/analytics/search" element={<SearchAnalytics />} />
              </Routes>
            </div>
          </main>
        </div>
      </>)}

    </div>
  );
}

export default App;
