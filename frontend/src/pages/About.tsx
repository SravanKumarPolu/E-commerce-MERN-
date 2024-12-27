import Title from "../components/Title";
import { assets } from "../assets/assets";

const About = () => {
  return (
    <div className="text-2xl text-center pt-8 border-t">
      {/* About Us Title */}
      <div className="text-3xl text-center pt-8 border-t font-raleway text-gray-900">
        <Title text1={'ABOUT'} text2={'US'} />
      </div>

      {/* About Content */}
      <div className="my-12 flex flex-col md:flex-row gap-16 md:gap-24">
        <img className="w-full md:max-w-[450px] rounded-lg shadow-lg mx-auto md:mx-0" src={assets.about_img} alt="About Apple" />
        <div className="flex flex-col justify-center gap-6 md:w-2/3 text-gray-600 font-notoSans">
          <p className="leading-relaxed text-lg">
            At the Apple Store, we invite you to explore our latest range of products, from iPhones to Macs, designed to fit your lifestyle. Whether you're upgrading your current device or discovering new innovations, we have everything you need. Follow us for the latest updates, tech tips, and exclusive offers. Experience the future of technology today with Apple.
          </p>
          <p className="leading-relaxed text-lg">
            <span className="font-raleway font-semibold">Our mission at Apple is clear :</span>  to create the best products and deliver exceptional service that empowers our customers. We are committed to innovation, sustainability, and making technology accessible for everyone. Join us in shaping the future of tech with groundbreaking products and services.
          </p>
          <b className="text-gray-800 font-raleway text-xl">Our Mission</b>
          <p className="leading-relaxed text-lg">
            Our mission is simple: to create products that enrich people's lives and provide an unparalleled customer experience. From groundbreaking devices to unmatched customer support, we strive to make Apple a brand that inspires and empowers the world.
          </p>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="text-4xl font-raleway text-center py-8 text-gray-900">
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      {/* Benefits Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 text-sm text-gray-600">
        <div className="border px-10 py-8 sm:py-20 flex flex-col gap-5 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
          <h2 className="text-xl font-raleway font-semibold">Quality Assurance</h2>
          <p>Each Apple product undergoes rigorous testing to ensure it meets the highest standards of quality, durability, and performance.</p>
        </div>
        <div className="border px-10 py-8 sm:py-20 flex flex-col gap-5 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
          <h2 className="text-xl font-raleway font-semibold">Affordable Prices</h2>
          <p>We believe that innovation should be accessible to everyone, which is why we offer competitive pricing on all Apple devices and services.</p>
        </div>
        <div className="border px-10 py-8 sm:py-20 flex flex-col gap-5 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
          <h2 className="text-xl font-raleway font-semibold">Exceptional Service</h2>
          <p>From personalized support in-store to seamless online experiences, Apple’s customer service is always ready to help you get the most out of your device.</p>
        </div>
      </div>
    </div>
  );
};

export default About;
