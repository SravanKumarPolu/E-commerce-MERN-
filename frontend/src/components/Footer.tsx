import { assets } from "../assets/assets";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-100">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 px-6 py-12 mt-20 text-sm font-raleway">

        {/* Company Info */}
        <div>
          <img src={assets.logo} className="mb-4 w-16 mx-auto md:mx-0" alt="Company Logo" />
          <p className="text-sm text-gray-600 text-center md:text-left leading-relaxed font-notoSans">
            Apple Intelligence is available in beta on iPhone 16, 15 Pro/Max, and M1+ iPads and Macs. Requires Siri set to English and updates to iOS 18, iPadOS 18, or macOS Sequoia.
          </p>
        </div>

        {/* Company Links */}
        <div>
          <h3 className="text-lg font-semibold mb-5 text-center md:text-left text-gray-800">Company</h3>
          <ul className="flex flex-col gap-2 text-gray-600 text-center md:text-left font-notoSans">
            {["Home", "About Us", "Delivery", "Privacy Policy"].map((item) => (
              <li
                key={item}
                className="hover:text-gray-900 hover:translate-x-1 transition-all duration-200 cursor-pointer"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-5 text-center md:text-left text-gray-800">Get In Touch</h3>
          <ul className="flex flex-col gap-3 text-gray-600 text-center md:text-left font-notoSans">
            <li className="flex justify-center md:justify-start items-center gap-2 text-sm">
              <FaPhoneAlt className="text-gray-500" /> +00-000-000
            </li>
            <li className="flex justify-center md:justify-start items-center gap-2 text-sm">
              <FaEnvelope className="text-gray-500" /> contact@e-commerce.com
            </li>
          </ul>
        </div>

      </div>

      <div className="border-t border-gray-300 py-4">
        <p className="text-center text-gray-600 text-sm font-workSans">
          &copy; {new Date().getFullYear()} BuyMe You — All Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
