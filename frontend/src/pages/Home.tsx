import Hero from "../components/Hero";
import LatestCollection from "../components/LatestCollection";
import BestSeller from "../components/BestSeller";
import OurPolicy from "../components/OurPolicy";
import NewsletterBox from "../components/NewsLetterBox";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <div className="space-y-16 sm:space-y-20 lg:space-y-24">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="pt-4 sm:pt-6 lg:pt-8 pb-8 sm:pb-12 lg:pb-16"
      >
        <Hero />
      </motion.section>

      {/* Latest Products */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-8 sm:py-12 lg:py-16"
      >
        <LatestCollection />
      </motion.section>

      {/* Best Sellers */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
        className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-gray-50 to-white"
      >
        <BestSeller />
      </motion.section>

      {/* Policies */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
        className="py-8 sm:py-12 lg:py-16"
      >
        <OurPolicy />
      </motion.section>

      {/* Newsletter */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        viewport={{ once: true }}
        className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-blue-50 to-purple-50"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <NewsletterBox />
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
