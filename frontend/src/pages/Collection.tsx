import Title from "../components/Title";
import { assets } from "../assets/assets"
import { useState } from "react";

const Collection = () => {
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [, setSortType] = useState<string>('relavent');
  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* Filter Options */}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          Filter
          <img
            src={assets.dropdown_icon}
            className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
            alt=""
          />
        </p>
        {/* Category filter */}
        <div
          className={`border border-gray-300 pl-5 py-5 mt-6 ${showFilter ? "" : "hidden"} sm:block`}
        >
          <p className="mb-3 text-sm font-medium">Categories</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value="Watch"

              />
              Watch
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value="iPad"

              />
              iPad
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value="iPhone"

              />
              iPhone
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value="Laptop"

              />
              Laptop
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value="Airpods"

              />
              Airpods
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value="TV"

              />
              TV
            </p>
          </div>

        </div>
        {/* SubCategory */}
        <div
          className={`border border-gray-300 pl-5 py-5 mt-4 ${showFilter ? "" : "hidden"} sm:block`}
        >
          <p className="mb-3 text-sm font-medium">Type</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">

            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value="Plus"

              />
              Plus
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value="Pro"

              />
              Pro
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value="Ultra"

              />
              Ultra
            </p>
          </div>
        </div>
      </div>
      {/* Right Side */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1="All" text2="Collection" />
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border-2 border-gray-300 text-sm px-2"
          >
            <option value="relavent">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>
        {/* MapProduct */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          Products
        </div>

      </div>
    </div>
  )
}

export default Collection