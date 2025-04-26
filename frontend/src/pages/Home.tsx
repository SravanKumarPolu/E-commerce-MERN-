import Hero from "../components/Hero";
import LatestCollection from "../components/LatestCollection";
import BestSeller from "../components/BestSeller";
import OurPolicy from "../components/OurPolicy";
import NewsletterBox from "../components/NewsLetterBox";

const Home = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section>
        <Hero />
      </section>

      {/* Latest Products */}
      <section className="">
        <LatestCollection />
      </section>

      {/* Best Sellers */}
      <section className="">
        <BestSeller />
      </section>

      {/* Policies */}
      <section className="">
        <OurPolicy />
      </section>

      {/* Newsletter */}
      <section className=" px-4 sm:px-6 lg:px-8 py-4">
        <NewsletterBox />
      </section>
    </div>
  );
};

export default Home;
