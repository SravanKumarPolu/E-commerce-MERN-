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
    <section className="py-16 bg-base-100 ">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-center text-3xl md:text-4xl font-bold text-gray-200 mb-14">
          Our Policies
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center">
          {policies.map((item, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg hover:scale-[1.03] transition-all duration-300 cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.15 }}
              viewport={{ once: true }}
              role="region"
              aria-label={item.alt}
            >
              <img src={item.icon} alt={item.alt} className="w-14 mx-auto mb-5" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurPolicy;
