import { assets } from "../assets/assets"

const Footer = () => {
  return (
    <div className="bg-gray-100">
      <div className="font-raleway max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6 py-10 my-10 mt-20 text-sm">

        {/* Company Information */}
        <div className="w-full">
          <img src={assets.logo} className="mb-5 w-16 mx-auto md:mx-0" alt="Company Logo" />
          <p className="text-notoSans text-sm text-gray-600 text-center md:text-left ">
            Apple Intelligence is available in beta on all iPhone 16 models, iPhone 15 Pro, iPhone 15 Pro Max, iPad mini (A17 Pro), and iPad and Mac models with M1 and later, with Siri and device language set to English (Australia, Canada, Ireland, New Zealand, South Africa, UK or US),
            as part of an iOS 18, iPadOS 18, and macOS Sequoia software update.
          </p>
        </div>

        {/* Company Links */}
        <div className="w-full">
          <p className="text-xl font-raleway font-semibold mb-5 text-center md:text-left text-gray-800">Company</p>
          <ul className="flex flex-col gap-2 text-notoSans text-gray-600 text-center md:text-left">
            <li className="hover:text-gray-800 cursor-pointer transition duration-300">Home</li>
            <li className="hover:text-gray-800 cursor-pointer transition duration-300">About Us</li>
            <li className="hover:text-gray-800 cursor-pointer transition duration-300">Delivery</li>
            <li className="hover:text-gray-800 cursor-pointer transition duration-300">Privacy Policy</li>
          </ul>
        </div>

        {/* Get In Touch */}
        <div className="w-full">
          <p className="text-xl font-raleway font-semibold mb-5 text-center md:text-left text-gray-800">Get In Touch</p>
          <ul className="flex flex-col gap-2 text-notoSans text-gray-600 text-center md:text-left">
            <li className="text-sm">+00-000-000</li>
            <li className="text-sm">contact@buyme.com</li>
          </ul>
        </div>

      </div>
      <div className="border-t border-gray-300 py-5">
        <p className="text-sm text-center text-gray-600 font-workSans">
          &copy; 2024 BuyMe You - All Rights Reserved
        </p>
      </div>
    </div>


  )
}

export default Footer