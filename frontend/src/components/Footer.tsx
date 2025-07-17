import { assets } from "../assets/assets";
import { FaPhoneAlt, FaEnvelope, FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: ["Home", "About Us", "Delivery", "Privacy Policy", "Terms of Service"],
    support: ["Help Center", "Contact Us", "Returns", "Shipping Info", "Size Guide"],
    categories: ["iPhone", "iPad", "Mac", "Watch", "AirPods", "Accessories"]
  };

  const socialLinks = [
    { icon: FaTwitter, href: "#", label: "Twitter" },
    { icon: FaFacebook, href: "#", label: "Facebook" },
    { icon: FaInstagram, href: "#", label: "Instagram" },
    { icon: FaLinkedin, href: "#", label: "LinkedIn" }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-green-500 to-blue-600 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
            {/* Company Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img src={assets.logo} className="mb-4 sm:mb-6 w-12 sm:w-16" alt="Company Logo" />
              </motion.div>
              
              <p className="text-gray-600 leading-relaxed mb-4 sm:mb-6 font-medium text-sm sm:text-base">
                Experience the future of technology with our premium collection of Apple products. 
                Quality, innovation, and exceptional service at your fingertips.
              </p>

              {/* Social Links */}
              <div className="flex gap-3 sm:gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-blue-600 hover:shadow-lg transition-all duration-300"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <social.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Company Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
                <div className="w-6 h-1 sm:w-8 sm:h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                Company
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {footerLinks.company.map((item, index) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <a
                      href="#"
                      className="text-gray-600 hover:text-blue-600 hover:translate-x-1 transition-all duration-300 font-medium block text-sm sm:text-base"
                    >
                      {item}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Support Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
                <div className="w-6 h-1 sm:w-8 sm:h-1 bg-gradient-to-r from-green-600 to-blue-600 rounded-full"></div>
                Support
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {footerLinks.support.map((item, index) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <a
                      href="#"
                      className="text-gray-600 hover:text-blue-600 hover:translate-x-1 transition-all duration-300 font-medium block text-sm sm:text-base"
                    >
                      {item}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
                <div className="w-6 h-1 sm:w-8 sm:h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
                Get In Touch
              </h3>
              
              <div className="space-y-3 sm:space-y-4">
                <motion.div
                  className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                  whileHover={{ x: 5 }}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <FaPhoneAlt className="text-white text-xs sm:text-sm" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Phone</p>
                    <p className="font-semibold text-gray-800 text-sm sm:text-base">+1 (555) 123-4567</p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                  whileHover={{ x: 5 }}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                    <FaEnvelope className="text-white text-xs sm:text-sm" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Email</p>
                    <p className="font-semibold text-gray-800 text-sm sm:text-base">contact@applestore.com</p>
                  </div>
                </motion.div>
              </div>

              {/* Newsletter Signup */}
              <div className="mt-4 sm:mt-6">
                <h4 className="text-xs sm:text-sm font-semibold text-gray-800 mb-2 sm:mb-3">Newsletter</h4>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
                  />
                  <motion.button
                    className="px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-xs sm:text-sm hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Subscribe
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
              <motion.p
                className="text-gray-600 text-xs sm:text-sm font-medium"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                &copy; {currentYear} Apple Store — All Rights Reserved
              </motion.p>
              
              <motion.div
                className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
                  Terms of Service
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
                  Cookie Policy
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
