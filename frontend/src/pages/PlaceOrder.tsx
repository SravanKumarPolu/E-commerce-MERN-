import CartTotal from "../components/CartTotal";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import { useShopContext } from "../context/ShopContext";
import { useState } from "react";

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod');
  const [formData,] = useState({
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
  const { navigate } = useShopContext();
  return (
    <form className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t">
      {/* Left side */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className=" text-xl sm:text-2xl my-3">
          <Title text1={'DELIVERY '} text2={'INFORMATION'} />

        </div>
        <div className="flex gap-3">
          <input required
            name="firstName" value={formData.firstName}
            type="text" className="border border-gra-300 rounded py-1.5 px-3.5 w-full" placeholder="First name" />
          <input required
            name="lastName" value={formData.lastName}
            type="text" className="border border-gra-300 rounded py-1.5 px-3.5 w-full" placeholder="Last name" />
        </div>
        <input required
          name="email" value={formData.email}
          type="email" className="border border-gra-300 rounded py-1.5 px-3.5 w-full" placeholder="Email address " />
        <input required
          name="street" value={formData.street}
          type="text" className="border border-gra-300 rounded py-1.5 px-3.5 w-full" placeholder="Street" />
        <div className="flex gap-3">
          <input required
            name="city" value={formData.city}
            type="text" className="border border-gra-300 rounded py-1.5 px-3.5 w-full" placeholder="City" />
          <input required
            name="state" value={formData.state}
            type="text" className="border border-gra-300 rounded py-1.5 px-3.5 w-full" placeholder="State" />
        </div>
        <div className="flex gap-3">
          <input required
            name="zipcode" value={formData.zipcode}
            type="number" className="border border-gra-300 rounded py-1.5 px-3.5 w-full" placeholder="ZipCode" />
          <input required
            name="country" value={formData.country}
            type="text" className="border border-gra-300 rounded py-1.5 px-3.5 w-full" placeholder="Country" />
        </div>
        <input required
          name="phone" value={formData.phone}
          type="number" className="border border-gra-300 rounded py-1.5 px-3.5 w-full" placeholder="Phone" />
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
              onClick={() => navigate('/orders')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-lg rounded-lg shadow-lg hover:from-indigo-600 hover:to-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300"
            >
              PLACE ORDER
            </button>
          </div>


        </div>
      </div>

    </form>
  )
}

export default PlaceOrder