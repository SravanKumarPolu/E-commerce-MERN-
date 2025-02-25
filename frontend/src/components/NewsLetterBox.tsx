import { motion } from "framer-motion";
import { useState } from "react";

const NewsletterBox = () => {
  const [email, setEmail] = useState("");

  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) return;
    alert("Thank you for subscribing! 🎉");
    setEmail("");
  };

  return (
    <motion.div
      className="flex flex-col text-center p-6 bg-gray-50 rounded-2xl shadow-lg max-w-lg mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-2xl font-semibold text-gray-900">Subscribe & Get 20% Off</p>
      <p className="text-gray-500 mt-3 mb-6 text-lg">Sign up for exclusive deals and updates.</p>

      <form onSubmit={onSubmitHandler} className="flex items-center gap-3 w-full">
        <input
          className="flex-1 p-2 text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-black text-white text-sm font-medium px-5 py-3 rounded-lg hover:bg-gray-800 transition-all duration-300"
        >
          Subscribe
        </button>
      </form>
    </motion.div>
  );
};

export default NewsletterBox;
