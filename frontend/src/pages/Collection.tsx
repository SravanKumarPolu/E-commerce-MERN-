import { useEffect, useState } from "react";

import ProductItems from "../components/ProductItems";
import Title from "../components/Title";
import { assets } from "../assets/assets"
import { useShopContext } from "../context/ShopContext";

const Collection = () => {
  const { products } = useShopContext();
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [sortType, setSortType] = useState<string>('relavent');

  const [filterProducts, setFilterProducts] = useState<typeof products>([]);
  const [category, setCategory] = useState<string[]>([]);
  const toggleCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (category.includes(e.target.value)) {
      setCategory(prev => prev.filter(item => item !== e.target.value))
    }
    else {
      setCategory(prev => [...prev, e.target.value])
    }
  }

  const [subCategory, setSubCategory] = useState<string[]>([]);
  const toggleSubCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory(prev => prev.filter(item => item !== e.target.value))
    }
    else {
      setSubCategory(prev => [...prev, e.target.value])
    }
  }

  const applyFilter = () => {
    let productsCopy = products.slice()
    if (category.length > 0) {
      productsCopy = productsCopy.filter(item => category.includes(item.category))
    }
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory))
    }
    setFilterProducts(productsCopy)
  }
  useEffect(() => {
    applyFilter();
  }, [category, subCategory])

  const sortProduct = () => {
    const fpCopy = filterProducts.slice();
    switch (sortType) {
      case 'low-high':
        setFilterProducts(fpCopy.sort((a, b) => (a.price - b.price)));
        break;
      case 'high-low':
        setFilterProducts(fpCopy.sort((a, b) => (b.price - a.price)))
        break;
      default:
        applyFilter();
        break;
    }
  }
  useEffect(() => {
    sortProduct();
  }, [sortType])
  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* Filter Options */}
      <div className="w-full sm:w-64 bg-base-200 p-4 rounded-lg shadow-md">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          Filter
          <img
            src={assets.dropdown_icon}
            className={`h-3 sm:hidden ${showFilter ? "rotate-10" : ""}`}
            alt=""
          />
        </p>
        <div className={`${showFilter ? "block" : "hidden"} sm:block mt-4 space-y-4`}>
          {/* Category filter */}
          <div className="border p-3  rounded-lg  bg-white shadow-sm">
            <p className="font-medium text-sm my-1">Categories</p>
            <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
              <p className="flex gap-1">
                <input
                  className="w-3"
                  type="checkbox"
                  value="Watch"
                  onChange={toggleCategory}
                />
                Watch
              </p>
              <p className="flex gap-1">
                <input
                  className="w-3"
                  type="checkbox"
                  value="iPad"
                  onChange={toggleCategory}
                />
                iPad
              </p>
              <p className="flex gap-1">
                <input
                  className="w-3"
                  type="checkbox"
                  value="iPhone"
                  onChange={toggleCategory}
                />
                iPhone
              </p>
              <p className="flex gap-1">
                <input
                  className="w-3"
                  type="checkbox"
                  value="Laptop"
                  onChange={toggleCategory}
                />
                Laptop
              </p>
              <p className="flex gap-1">
                <input
                  className="w-3"
                  type="checkbox"
                  value="Airpods"
                  onChange={toggleCategory}
                />
                Airpods
              </p>
              <p className="flex gap-1">
                <input
                  className="w-3"
                  type="checkbox"
                  value="TV"
                  onChange={toggleCategory}
                />
                TV
              </p>
            </div>

          </div>

          {/* SubCategory */}
          <div className="border p-3 rounded-lg bg-white shadow-sm">
            <p className="font-medium text-sm my-1">Type</p>
            <div className="flex flex-col gap-2 text-sm font-light text-gray-700">

              <p className="flex gap-1">
                <input
                  className="w-3"
                  type="checkbox"
                  value="Plus"
                  onChange={toggleSubCategory}
                />
                Plus
              </p>
              <p className="flex gap-1">
                <input
                  className="w-3"
                  type="checkbox"
                  value="Pro"
                  onChange={toggleSubCategory}
                />
                Pro
              </p>
              <p className="flex gap-1">
                <input
                  className="w-3"
                  type="checkbox"
                  value="Ultra"
                  onChange={toggleSubCategory}

                />
                Ultra
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Right Side */}
      <div className="flex-1">
        <div className="flex justify-between items-center text-base sm:text-2xl mb-4">
          <Title text1="All" text2="Collection" />
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="select select-bordered  text-sm "
          >
            <option value="relavent">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>
        {/* MapProduct */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {
            filterProducts.map((item) => (
              <ProductItems key={item._id} id={item._id} image={item.image} name={item.name} price={item.price} />
            ))
          }
        </div>
        </div>

    </div>
  )
}

export default Collection