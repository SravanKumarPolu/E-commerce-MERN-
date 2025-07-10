// src/App.jsx
import "./App.css";
import { Route, Routes,  } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "./layout/Layout";
import ScrollToTop from "./utils/ScrollToTop";

// Lazy-loaded pages
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Collection = lazy(() => import("./pages/Collection"));
const Contact = lazy(() => import("./pages/Contact"));
const Product = lazy(() => import("./pages/Product"));
const Cart = lazy(() => import("./pages/Cart"));
const Login = lazy(() => import("./pages/Login"));
const Orders = lazy(() => import("./pages/Orders"));
const PlaceOrder = lazy(() => import("./pages/PlaceOrder"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Optional: preload some key routes
export const preloadHome = () => import("./pages/Home");

function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-screen">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/product/:productId" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/place-order" element={<PlaceOrder />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </Suspense>
    </>
  );
}

export default App;
