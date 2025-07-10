import Hero from "../components/Hero";
import LatestCollection from "../components/LatestCollection";
import BestSeller from "../components/BestSeller";
import OurPolicy from "../components/OurPolicy";
import NewsletterBox from "../components/NewsLetterBox";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-16 px-4 sm:px-6 lg:px-8 font-inter"
    >
      <section id="hero" aria-label="Hero Section">
        <Hero />
      </section>

      <section id="latest-products" aria-label="Latest Products Section">
        <LatestCollection />
      </section>

      <section id="best-sellers" aria-label="Best Seller Products">
        <BestSeller />
      </section>

      <section id="our-policies" aria-label="Store Policies">
        <OurPolicy />
      </section>

      <section id="newsletter" aria-label="Newsletter Subscription">
        <NewsletterBox />
      </section>
    </motion.div>
  );
};

export default Home;
