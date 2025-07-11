import { assets } from '../assets/assets';
import { motion } from 'framer-motion';

const policies = [
  {
    icon: assets.exchange_icon,
    title: "Easy Exchange Policy",
    desc: "We offer a hassle-free exchange policy",
    alt: "Exchange Policy",
  },
  {
    icon: assets.quality_icon,
    title: "7 Days Return Policy",
    desc: "We provide a 7-day free return policy",
    alt: "Return Policy",
  },
  {
    icon: assets.support_img,
    title: "Best Customer Support",
    desc: "We provide 24/7 customer support",
    alt: "Customer Support",
  },
];

const OurPolicy = () => {
  return (
    <section
      className="py-16 sm:py-20 lg:py-24 bg-base-100"
      aria-labelledby="policy-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <h2
          id="policy-heading"
          className="text-center text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-14"
        >
          Our Policies
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center">
          {policies.map((item) => (
            <motion.div
              key={item.title}
              className="bg-white rounded-xl p-6 sm:p-7 lg:p-8 shadow-md focus:outline-none focus:ring-2 focus:ring-accent"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
              }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              tabIndex={0}
              role="button"
              aria-label={item.alt || item.title}
            >
              <img
                src={item.icon}
                alt={item.alt || item.title}
                className="w-14 mx-auto mb-5"
              />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                {item.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurPolicy;
