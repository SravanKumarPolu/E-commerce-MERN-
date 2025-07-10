import { assets } from "../assets/assets";
import { FaPhoneAlt, FaEnvelope, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  const companyLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Delivery", href: "/delivery" },
    { name: "Privacy Policy", href: "/privacy" }
  ];

  return (
    <footer className="bg-gray-100" aria-label="Footer">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 px-6 py-14 mt-20 text-sm font-sans">

        {/* Company Info */}
        <div>
          <img
            src={assets.logo}
            alt="Apple Store logo"
            className="mb-5 w-16 mx-auto md:mx-0"
          />
          <p className="text-gray-600 text-center md:text-left leading-relaxed tracking-wide">
            Apple Intelligence is available in beta on iPhone 16, 15 Pro/Max, and M1+ iPads and Macs. Requires Siri set to English and updates to iOS 18, iPadOS 18, or macOS Sequoia.
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="text-lg font-semibold mb-5 text-center md:text-left text-gray-800 tracking-wide">
            Company
          </h3>
          <ul className="flex flex-col gap-2 text-gray-600 text-center md:text-left">
            {companyLinks.map(({ name, href }) => (
              <li key={name}>
                <Link
                  to={href}
                  className="hover:text-gray-900 hover:translate-x-1 transition-all duration-200 ease-in-out inline-block tap-highlight-transparent"
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info & Socials */}
        <div>
          <h3 className="text-lg font-semibold mb-5 text-center md:text-left text-gray-800 tracking-wide">
            Get In Touch
          </h3>
          <ul className="flex flex-col gap-3 text-gray-600 text-center md:text-left">
            <li className="flex justify-center md:justify-start items-center gap-2">
              <FaPhoneAlt className="text-gray-500" />
              <span className="select-text">+00-000-000</span>
            </li>
            <li className="flex justify-center md:justify-start items-center gap-2">
              <FaEnvelope className="text-gray-500" />
              <span className="select-text">contact@Apple-Store.com</span>
            </li>
          </ul>

          {/* Social Icons */}
          <div className="flex justify-center md:justify-start gap-4 mt-5">
            <a href="#" aria-label="Twitter">
              <FaTwitter className="text-gray-500 hover:text-blue-500 transition" />
            </a>
            <a href="#" aria-label="Instagram">
              <FaInstagram className="text-gray-500 hover:text-pink-500 transition" />
            </a>
            <a href="#" aria-label="LinkedIn">
              <FaLinkedin className="text-gray-500 hover:text-blue-700 transition" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-300 py-4">
        <p className="text-center text-gray-600 text-sm tracking-wide">
          &copy; {new Date().getFullYear()} Apple Store You — All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
