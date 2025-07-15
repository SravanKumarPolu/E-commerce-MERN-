import { useState, useEffect } from "react";
import { useShopContext } from "../context/ShopContext";
import AddressBook from "../components/AddressBook";
import CartTotal from "../components/CartTotal";
import Title from "../components/Title";
import PayPalPayment from "../components/PayPalPayment";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

const paymentMethods = [
  { key: "paypal", label: "PayPal", icon: assets.paypal_logo },
  { key: "cod", label: "Cash on Delivery", icon: null },
];

const validateEmail = (email: string) => /.+@.+\..+/.test(email);
const validatePhone = (phone: string) => /^\d{7,15}$/.test(phone);

const PlaceOrder = () => {
  const { token, isLoggedIn, getCartAmount, delivery_fee } = useShopContext();
  const [method, setMethod] = useState("cod");
  const [showPayPalPayment, setShowPayPalPayment] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: '',
  });
  const [defaultAddress, setDefaultAddress] = useState<any>(null);
  const [allAddresses, setAllAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [mode, setMode] = useState<'add' | 'edit' | 'view'>('add');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Calculate total amount
  const subtotal = getCartAmount();
  const total = subtotal + delivery_fee;

  useEffect(() => {
    if (defaultAddress && mode === "add") {
      setFormData({
        firstName: defaultAddress.firstName || '',
        lastName: defaultAddress.lastName || '',
        email: defaultAddress.email || '',
        street: defaultAddress.street || '',
        city: defaultAddress.city || '',
        state: defaultAddress.state || '',
        zipcode: defaultAddress.zipcode || '',
        country: defaultAddress.country || '',
        phone: defaultAddress.phone || '',
      });
    }
  }, [defaultAddress, mode]);

  const handleUseAddress = (address: any) => {
    setFormData({
      firstName: address.firstName || '',
      lastName: address.lastName || '',
      email: address.email || '',
      street: address.street || '',
      city: address.city || '',
      state: address.state || '',
      zipcode: address.zipcode || '',
      country: address.country || '',
      phone: address.phone || '',
    });
    setMode("view");
    setSelectedAddressId(address._id);
  };

  const handleNewAddress = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      street: '',
      city: '',
      state: '',
      zipcode: '',
      country: '',
      phone: '',
    });
    setMode("add");
    setSelectedAddressId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error("You must be logged in to save an address.");
      return;
    }
    if (!validateEmail(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!validatePhone(formData.phone)) {
      toast.error("Please enter a valid phone number (7-15 digits).");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/user/address`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token,
        },
        body: JSON.stringify(formData),
      });
      const res = await response.json();
      if (res.success) {
        toast.success("Address saved to your profile!");
        setMode("view");
      } else {
        toast.error(res.message || "Failed to save address.");
      }
    } catch (error) {
      toast.error("Error saving address.");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = () => {
    // Validate address
    if (!formData.firstName || !formData.email || !formData.street || !formData.city || !formData.state || !formData.zipcode || !formData.country || !formData.phone) {
      toast.error("Please fill in all address fields.");
      return;
    }

    if (method === "paypal") {
      setShowPayPalPayment(true);
    } else {
      // Handle other payment methods
      toast.success("Order placed successfully!");
    }
  };

  const handlePayPalSuccess = () => {
    toast.success("Payment completed! Order placed successfully.");
    setShowPayPalPayment(false);
    // Redirect to orders page to show the new order
    navigate('/orders');
  };

  const handlePayPalError = (error: any) => {
    console.error("PayPal payment error:", error);
    setShowPayPalPayment(false);
  };

  const handlePayPalCancel = () => {
    setShowPayPalPayment(false);
    toast.info("PayPal payment cancelled.");
  };

  // Show PayPal payment component if selected
  if (showPayPalPayment) {
    return (
      <PayPalScriptProvider 
        options={{ 
          clientId: "AbOtiWHzUtnR9K6vDyyfTHQw0px-yRPwUngXPDoN7HbRZSkyMR65KNCvNEqvEldeouNwTwRKihtu1pCl",
          currency: "USD"
        }}
      >
        <div className="min-h-screen bg-gray-50 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <button
                onClick={() => setShowPayPalPayment(false)}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Back to checkout
              </button>
            </div>
            <PayPalPayment
              amount={total}
              address={formData}
              onSuccess={handlePayPalSuccess}
              onError={handlePayPalError}
              onCancel={handlePayPalCancel}
            />
          </div>
        </div>
      </PayPalScriptProvider>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 p-4 md:p-10 bg-gray-50 min-h-screen">
      {/* Left: Address and Delivery */}
      <div className="flex-1 max-w-xl mx-auto">
        <Title text1="DELIVERY " text2="INFORMATION" />
        <div className="mb-6">
          <AddressBook
            onDefaultAddress={setDefaultAddress}
            onAddresses={setAllAddresses}
          />
          {allAddresses.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Choose a saved address:</h3>
              <div className="flex flex-wrap gap-3">
                <AnimatePresence>
                  {allAddresses.map((addr) => (
                    <motion.div
                      key={addr._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className={`p-3 border rounded w-64 cursor-pointer transition-all duration-150 shadow-sm bg-white hover:shadow-md ${addr.default ? "border-blue-500 bg-blue-50" : "border-gray-200"} ${selectedAddressId === addr._id ? "ring-2 ring-green-500" : ""}`}
                    >
                      <div className="font-semibold">
                        {addr.firstName} {addr.lastName} {addr.default && (
                          <span className="text-xs text-blue-600">(Default)</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-700">
                        {addr.street}, {addr.city}, {addr.state}, {addr.zipcode}, {addr.country}
                      </div>
                      <div className="text-sm text-gray-500">
                        Email: {addr.email} | Phone: {addr.phone}
                      </div>
                      <button
                        type="button"
                        aria-label="Use this address"
                        onClick={() => handleUseAddress(addr)}
                        className="mt-2 text-xs bg-blue-600 text-white px-2 py-1 rounded"
                      >
                        Use this address
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col justify-center"
                >
                  <button
                    type="button"
                    aria-label="Add new address"
                    onClick={handleNewAddress}
                    className="text-xs bg-green-600 text-white px-2 py-1 rounded"
                  >
                    New Address
                  </button>
                </motion.div>
              </div>
            </div>
          )}
        </div>
        {/* Delivery form as a card/modal */}
        <motion.form
          layout
          className="bg-white rounded-lg shadow p-6 space-y-4 relative"
          onSubmit={handleSubmit}
        >
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
              <div className="loader border-4 border-blue-200 border-t-blue-600 rounded-full w-10 h-10 animate-spin"></div>
            </div>
          )}
          <div className="flex gap-3">
            <div className="w-1/2">
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                type="text"
                className="border border-gray-300 rounded py-2 px-4 w-full focus:ring-2 focus:ring-blue-200"
                placeholder="First name"
                aria-label="First name"
                required
                disabled={mode === "view"}
              />
            </div>
            <div className="w-1/2">
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                type="text"
                className="border border-gray-300 rounded py-2 px-4 w-full focus:ring-2 focus:ring-blue-200"
                placeholder="Last name"
                aria-label="Last name"
                required
                disabled={mode === "view"}
              />
            </div>
          </div>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            className="border border-gray-300 rounded py-2 px-4 w-full focus:ring-2 focus:ring-blue-200"
            placeholder="Email address "
            aria-label="Email address"
            required
            disabled={mode === "view"}
          />
          <input
            name="street"
            value={formData.street}
            onChange={handleChange}
            type="text"
            className="border border-gray-300 rounded py-2 px-4 w-full focus:ring-2 focus:ring-blue-200"
            placeholder="Street"
            aria-label="Street"
            required
            disabled={mode === "view"}
          />
          <div className="flex gap-3">
            <div className="w-1/2">
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                type="text"
                className="border border-gray-300 rounded py-2 px-4 w-full focus:ring-2 focus:ring-blue-200"
                placeholder="City"
                aria-label="City"
                required
                disabled={mode === "view"}
              />
            </div>
            <div className="w-1/2">
              <input
                name="state"
                value={formData.state}
                onChange={handleChange}
                type="text"
                className="border border-gray-300 rounded py-2 px-4 w-full focus:ring-2 focus:ring-blue-200"
                placeholder="State"
                aria-label="State"
                required
                disabled={mode === "view"}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-1/2">
              <input
                name="zipcode"
                value={formData.zipcode}
                onChange={handleChange}
                type="text"
                className="border border-gray-300 rounded py-2 px-4 w-full focus:ring-2 focus:ring-blue-200"
                placeholder="ZipCode"
                aria-label="Zip code"
                required
                disabled={mode === "view"}
              />
            </div>
            <div className="w-1/2">
              <input
                name="country"
                value={formData.country}
                onChange={handleChange}
                type="text"
                className="border border-gray-300 rounded py-2 px-4 w-full focus:ring-2 focus:ring-blue-200"
                placeholder="Country"
                aria-label="Country"
                required
                disabled={mode === "view"}
              />
            </div>
          </div>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            type="text"
            className="border border-gray-300 rounded py-2 px-4 w-full focus:ring-2 focus:ring-blue-200"
            placeholder="Phone"
            aria-label="Phone"
            required
            disabled={mode === "view"}
          />
          <div className="flex gap-2 justify-end mt-4">
            {mode === "add" && (
              <button
                type="button"
                aria-label="Add address"
                onClick={() => setMode("edit")}
                className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
              >
                Add
              </button>
            )}
            {mode === "view" && (
              <button
                type="button"
                aria-label="Edit address"
                onClick={() => setMode("edit")}
                className="bg-yellow-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-600"
              >
                Edit
              </button>
            )}
            {mode === "edit" && (
              <button
                type="submit"
                aria-label="Save address"
                className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            )}
          </div>
        </motion.form>
      </div>
      {/* Right: Order Summary and Payment */}
      <div className="flex-1 max-w-md mx-auto">
        <div className="sticky top-8">
          <Title text1="ORDER " text2="SUMMARY" />
          <CartTotal />
          <div className="mt-8">
            <Title text1="PAYMENT " text2="METHOD" />
            <div className="flex flex-col gap-3 mt-4">
              {paymentMethods.map((pm) => (
                <button
                  key={pm.key}
                  type="button"
                  aria-label={`Select payment method: ${pm.label}`}
                  onClick={() => setMethod(pm.key)}
                  className={`flex items-center gap-3 border p-3 rounded-lg shadow-sm transition-all duration-150 ${method === pm.key ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300"} hover:shadow-md`}
                >
                  {pm.icon && (
                    <img src={pm.icon} alt={pm.label} className="h-6 w-6" />
                  )}
                  <span className="font-medium">{pm.label}</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              aria-label="Place order"
              onClick={handlePlaceOrder}
              className="w-full mt-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition"
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;