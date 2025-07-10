import { motion } from "framer-motion";
import { useState, useRef } from "react";

const NewsletterBox = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Simple email format check
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    setSubmitted(true);
    setEmail("");

    if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    timeoutIdRef.current = setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <motion.div
      className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl px-6 py-10 sm:px-12 text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Heading */}
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
        Subscribe & <span className="text-accent">Get 20% Off</span>
      </h2>
      <p className="text-gray-500 text-sm sm:text-base mt-3 mb-6 max-w-md mx-auto leading-relaxed">
        Join our newsletter for exclusive deals, style updates, and new product drops.
      </p>

      {/* Form */}
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col sm:flex-row items-center gap-3 w-full"
        aria-live="polite"
        noValidate
      >
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          name="email"
          placeholder="Enter your email"
          className="w-full flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:outline-none text-gray-800 text-sm sm:text-base"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-black text-white font-semibold px-6 py-3 rounded-lg hover:bg-gray-800 transition-all duration-300 w-full sm:w-auto text-sm sm:text-base flex items-center justify-center gap-1"
        >
          Subscribe <span className="text-base">📬</span>
        </button>
      </form>

      {/* Success Message */}
      {submitted && (
        <motion.p
          className="text-green-600 text-sm sm:text-base mt-4"
          role="alert"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          🎉 You're subscribed! Check your inbox.
        </motion.p>
      )}
    </motion.div>
  );
};

export default NewsletterBox;
