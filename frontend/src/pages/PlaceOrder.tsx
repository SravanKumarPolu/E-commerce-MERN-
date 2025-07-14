import CartTotal from "../components/CartTotal";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import { useShopContext } from "../context/ShopContext";
import { useState, useEffect } from "react";
import AddressBook from "../components/AddressBook";

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod');
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
  const [mode, setMode] = useState<'add' | 'edit' | 'view'>('add');
  const { navigate, token, isLoggedIn } = useShopContext();
  const [defaultAddress, setDefaultAddress] = useState<any>(null);

  // Auto-fill form with default address when it changes and mode is 'add'
  useEffect(() => {
    if (defaultAddress && mode === 'add') {
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

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit (Add or Save)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert('You must be logged in to save an address.');
      return;
    }
    try {
      const response = await fetch('http://localhost:3001/api/user/address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        alert('Address saved to your profile!');
        setMode('view');
      } else {
        alert(data.message || 'Failed to save address.');
      }
    } catch (error) {
      alert('Error saving address.');
    }
  };

  // Handlers for Add, Edit, Save
  const handleAdd = () => setMode('edit');
  const handleEdit = () => setMode('edit');
  // Save is handled by form submit

  return (
    <div>
      <AddressBook onDefaultAddress={setDefaultAddress} />
      <form className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t" onSubmit={handleSubmit}>
        {/* Left side */}
        <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
          <div className=" text-xl sm:text-2xl my-3">
            <Title text1={'DELIVERY '} text2={'INFORMATION'} />
          </div>
          <div className="flex gap-3">
            <input required
              name="firstName" value={formData.firstName} onChange={handleChange}
              type="text" className="border border-gra-300 rounded py-1.5 px-3.5 w-full" placeholder="First name"
              disabled={mode === 'view'} />
            <input required
              name="lastName" value={formData.lastName} onChange={handleChange}
              type="text" className="border border-gra-300 rounded py-1.5 px-3.5 w-full" placeholder="Last name"
              disabled={mode === 'view'} />
          </div>
          <input required
            name="email" value={formData.email} onChange={handleChange}
            type="email" className="border border-gra-300 rounded py-1.5 px-3.5 w-full" placeholder="Email address "
            disabled={mode === 'view'} />
          <input required
            name="street" value={formData.street} onChange={handleChange}
            type="text" className="border border-gra-300 rounded py-1.5 px-3.5 w-full" placeholder="Street"
            disabled={mode === 'view'} />
          <div className="flex gap-3">
            <input required
              name="city" value={formData.city} onChange={handleChange}
              type="text" className="border border-gra-300 rounded py-1.5 px-3.5 w-full" placeholder="City"
              disabled={mode === 'view'} />
            <input required
              name="state" value={formData.state} onChange={handleChange}
              type="text" className="border border-gra-300 rounded py-1.5 px-3.5 w-full" placeholder="State"
              disabled={mode === 'view'} />
          </div>
          <div className="flex gap-3">
            <input required
              name="zipcode" value={formData.zipcode} onChange={handleChange}
              type="number" className="border border-gra-300 rounded py-1.5 px-3.5 w-full" placeholder="ZipCode"
              disabled={mode === 'view'} />
            <input required
              name="country" value={formData.country} onChange={handleChange}
              type="text" className="border border-gra-300 rounded py-1.5 px-3.5 w-full" placeholder="Country"
              disabled={mode === 'view'} />
          </div>
          <input required
            name="phone" value={formData.phone} onChange={handleChange}
            type="number" className="border border-gra-300 rounded py-1.5 px-3.5 w-full" placeholder="Phone"
            disabled={mode === 'view'} />
          {/* Button logic below the form */}
          <div className="mt-4 flex gap-2">
            {mode === 'add' && (
              <button type="button" onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
            )}
            {mode === 'view' && (
              <button type="button" onClick={handleEdit} className="bg-yellow-500 text-white px-4 py-2 rounded">Edit</button>
            )}
            {mode === 'edit' && (
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
            )}
          </div>
        </div>
        {/* Right side */}
        <div className="mt-8">
          <div className="mt-8 min-w-80">
            <CartTotal />
          </div>
          <div className="mt-12">
            <Title text1={'PAYMENT '} text2={'METHOD'} />
            {/* --- Payment Methods--- */}
            <div className="flex gap-3 flex-col ">
              <div
                onClick={() => setMethod('stripe')}
                className="flex items-center gap-3 border p-2 px-3 cursor-pointer ">
                <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`}>  </p>
                <img className=" h-4 mx-4 " src={assets.stripe_logo} alt="" />
              </div>
              <div
                onClick={() => setMethod('razorpay')}
                className="flex items-center gap-3 border p-2 px-3 cursor-pointer ">
                <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-400' : ''}`}></p>
                <img className="h-4 mx-4 " src={assets.razorpay_logo} alt="" />
              </div>
              <div
                onClick={() => setMethod('GPay')}
                className="flex items-center gap-3 border p-2 px-3 cursor-pointer ">
                <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'GPay' ? 'bg-green-400' : ''}`}></p>
                <img className=" h-4 mx-4 " src={assets.GPay_logo} alt="" />
              </div>
              <div
                onClick={() => setMethod('patym')}
                className="flex items-center gap-3 border p-2 px-3 cursor-pointer ">
                <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'paytm' ? 'bg-green-400' : ''}`}></p>
                <img className="h-4 mx-4 " src={assets.paytm_logo} alt="" />
              </div>
              <div onClick={() => setMethod('cod')} className="flex items-center gap-3 border p-2 px-3 cursor-pointer  ">
                <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
                <p className="text-gray-500 text-sm font-medium h-4 mx-4">CASH ON DELIVERY</p>
              </div>
            </div>

            <div className="w-full flex justify-end mt-8">
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-lg rounded-lg shadow-lg hover:from-indigo-600 hover:to-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300"
              >
                PLACE ORDER
              </button>
            </div>


          </div>
        </div>

      </form>
    </div>
  )
}

export default PlaceOrder