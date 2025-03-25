import { Route, Routes } from "react-router-dom";

import Add from "./pages/add";
import List from "./pages/list";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Orders from "./pages/orders";
import Sidebar from "./components/Sidebar";
import { useState } from "react";

export const backendUrl: string = import.meta.env.VITE_BACKEND_URL;
const App = () => {
  const [token, setToken] = useState('')
  return (
    <div className="min-h-screen bg-gray-50 text-gray-700">
      {token === '' ? (<Login />) : (<>
        {/* Sticky Navbar */}
        <Navbar />

        {/* Main layout */}
        <div className="flex">
          {/* Sidebar */}
          <Sidebar />

          {/* Content */}
          <main className="flex-1 px-6 py-8 md:ml-0">
            <div className="max-w-5xl mx-auto">
              <Routes>
                <Route path="/add" element={<Add />} />
                <Route path="/list" element={<List />} />
                <Route path="/orders" element={<Orders />} />
              </Routes>
            </div>
          </main>
        </div>
      </>)}

    </div>
  );
}

export default App;
