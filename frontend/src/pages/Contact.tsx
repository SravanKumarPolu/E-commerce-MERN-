import NewsletterBox from "../components/NewsLetterBox";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Contact = () => {
  return (
    <div className="bg-gray-100 font-inter pb-2 ">
      {/* Page Title */}
      <section className=" px-4 pt-12 border-t border-gray-200 text-center">
        <Title text1="CONTACT" text2="US" />
      </section>

      {/* Contact Content */}
      <section className="my-16 flex flex-col md:flex-row gap-12 items-center justify-center px-6 lg:px-20">
        {/* Image */}
        <img
          className="w-full bg-white max-w-[400px] md:max-w-[500px] rounded-xl shadow-xl"
          src={assets.contact_img}
          alt="Contact us illustration showing Apple store communication"
        />

        {/* Store Info */}
        <div className="flex flex-col justify-center items-start gap-8 md:max-w-md w-full">
          <div>
            <h2 className="font-oswald text-xl font-semibold text-gray-700" aria-label="Our Store Address">
              Our Store
            </h2>
            <address className="not-italic text-gray-500 mt-2 text-sm leading-relaxed">
              54709 Willms Station<br />
              Suite 350, Washington, USA
            </address>
          </div>

          <div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Tel: (415) 555-0132<br />
              Email: admin@buyMe.com
            </p>
          </div>

          <div>
            <h2 className="font-oswald text-xl font-semibold text-gray-700" aria-label="Career Information">
              Careers at Buy Me
            </h2>
            <p className="text-gray-500 mt-2 text-sm leading-relaxed">
              Learn more about our teams and job openings.
            </p>
            <Link
              to="/careers"
              className="mt-4 inline-block bg-gray-900 text-white px-6 py-3 text-sm font-fjallaOne rounded-md hover:bg-gray-700 transition-all duration-300"
            >
              Explore Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="px-4 mt-12">
        <NewsletterBox />
      </section>
    </div>
  );
};

export default Contact;
