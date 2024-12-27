import NewsletterBox from "../components/NewsLetterBox";
import Title from "../components/Title";
import { assets } from "../assets/assets";

const Contact = () => {
  return (
    <div className="bg-gray-100 font-inter">
      <div className="text-2xl ml-1 text-center pt-12 border-t border-gray-200">
        <Title text1="CONTACT" text2="US" />
      </div>
      <div className="my-16 flex  flex-col gap-12 md:flex-row items-center justify-center px-6 lg:px-20">
        <img
          className="w-full bg-base-100 max-w-[400px] md:max-w-[500px] rounded-lg shadow-lg"
          src={assets.contact_img}
          alt="Contact Illustration"
        />
        <div className="flex flex-col justify-center items-start gap-8 md:max-w-md">
          <div>
            <h2 className="font-semibold font-oswald text-xl text-gray-700">Our Store</h2>
            <p className="text-gray-500 mt-2">
              54709 Willms Station <br />
              Suite 350, Washington, USA
            </p>
          </div>
          <div>
            <p className="text-gray-500">
              Tel: (415) 555-0132 <br />
              Email: admin@buyMe.com
            </p>
          </div>
          <div>
            <h2 className="font-semibold font-oswald  text-xl text-gray-700">Careers at Buy Me</h2>
            <p className="text-gray-500 mt-2">
              Learn more about teams and job openings.
            </p>
            <button className="mt-4 font-fjallaOne bg-gray-900 text-white px-6 py-3 text-sm font-medium rounded-md hover:bg-gray-700 transition-all duration-300">
              Explore Jobs
            </button>
          </div>
        </div>
      </div>
      <NewsletterBox />
    </div>
  );
};

export default Contact;
