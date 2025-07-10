import NewsletterBox from "../components/NewsLetterBox";
import Title from "../components/Title";
import { assets } from "../assets/assets";

const About = () => {
  return (
    <>
      {/* About Us Section */}
      <section className="pt-10">
        <div className="text-center">
          <Title text1="ABOUT" text2="US" />
        </div>

        <div className="my-12 flex flex-col md:flex-row gap-16 md:gap-24 px-4 sm:px-6">
          <img
            src={assets.about_img || "/fallback.jpg"}
            alt="About Apple Store"
            className="w-full md:max-w-sm rounded-xl shadow-lg"
          />
          <div className="flex flex-col justify-center gap-6 md:w-2/3 text-gray-600 font-notoSans">
            <p className="leading-relaxed text-lg">
              At the Apple Store, we invite you to explore our latest range of products — from iPhones to Macs — designed to fit your lifestyle. Whether you're upgrading your current device or discovering new innovations, we have everything you need. Follow us for the latest updates, tech tips, and exclusive offers.
            </p>
            <b className="text-gray-800 font-raleway text-xl">Our Mission</b>
            <p className="leading-relaxed text-lg">
              At Apple, our mission is to create products that enrich people's lives and provide an unparalleled customer experience. We are committed to innovation, sustainability, and making technology accessible for everyone — empowering users worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 bg-white">
        <div className="text-center">
          <Title text1="WHY" text2="CHOOSE US" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 sm:px-6 mb-20 text-sm text-gray-600">
          {[
            {
              title: "Quality Assurance",
              desc: "Each Apple product undergoes rigorous testing to ensure it meets the highest standards of quality, durability, and performance.",
            },
            {
              title: "Affordable Prices",
              desc: "We believe that innovation should be accessible to everyone, which is why we offer competitive pricing on all Apple devices and services.",
            },
            {
              title: "Exceptional Service",
              desc: "From personalized support in-store to seamless online experiences, Apple’s customer service is always ready to help you get the most out of your device.",
            },
          ].map(({ title, desc }) => (
            <div
              key={title}
              className="border px-10 py-8 sm:py-20 flex flex-col gap-5 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 transform"
            >
              <h3 className="text-xl font-raleway font-semibold text-gray-800">
                {title}
              </h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="px-4 sm:px-6 pb-16">
        <NewsletterBox />
      </section>
    </>
  );
};

export default About;
