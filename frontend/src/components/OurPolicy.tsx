import { assets } from '../assets/assets';

const OurPolicy = () => {
  return (
    <section className="py-16 bg-base-100">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-2xl md:text-3xl font-bold text-gray-700 mb-10">
          Our Policies
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center">
          {/* Exchange Policy */}
          <div className="card bg-white shadow-md hover:shadow-lg p-6 rounded-lg transition-all duration-300">
            <img src={assets.exchange_icon} className="w-14 mx-auto mb-4" alt="Exchange Policy" />
            <h3 className="text-lg font-semibold text-gray-700">Easy Exchange Policy</h3>
            <p className="text-gray-500">We offer a hassle-free exchange policy</p>
          </div>

          {/* Return Policy */}
          <div className="card bg-white shadow-md hover:shadow-lg p-6 rounded-lg transition-all duration-300">
            <img src={assets.quality_icon} className="w-14 mx-auto mb-4" alt="Return Policy" />
            <h3 className="text-lg font-semibold text-gray-700">7 Days Return Policy</h3>
            <p className="text-gray-500">We provide a 7-day free return policy</p>
          </div>

          {/* Customer Support */}
          <div className="card bg-white shadow-md hover:shadow-lg p-6 rounded-lg transition-all duration-300">
            <img src={assets.support_img} className="w-14 mx-auto mb-4" alt="Customer Support" />
            <h3 className="text-lg font-semibold text-gray-700">Best Customer Support</h3>
            <p className="text-gray-500">We provide 24/7 customer support</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurPolicy;
