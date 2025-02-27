import Title from "../components/Title";
import { useState } from "react";

const PlaceOrder = () => {
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

      </div>

    </form>
  )
}

export default PlaceOrder