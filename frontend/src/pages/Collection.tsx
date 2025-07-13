import { useEffect, useState } from "react";

import ProductItems from "../components/ProductItems";
import Title from "../components/Title";
import { assets } from "../assets/assets"
import { useShopContext } from "../context/ShopContext";

const Collection = () => {
  const { products, search, showSearch, refreshProducts, isLoading } = useShopContext();
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
    if (showSearch && search) {
      productsCopy = productsCopy.filter(item => item.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
    }
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
  }, [category, search, showSearch, subCategory, products])

  const sortProduct = () => {
    let fpCopy = filterProducts.slice()
    switch (sortType) {
      case 'low-high':
        setFilterProducts(fpCopy.sort((a, b) => (a.price - b.price)))
        break
      case 'high-low':
        setFilterProducts(fpCopy.sort((a, b) => (b.price - a.price)))
        break
      default:
        applyFilter()
        break
    }
  }

  useEffect(() => {
    sortProduct()
  }, [sortType])

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* Filter Options */}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          FILTERS
          <img
            className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`}
            src={assets.dropdown_icon}
            alt=""
          />
        </p>

        {/* Category Filter */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value="iPhone"
                onChange={toggleCategory}
              />
              iPhone
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value="iPad"
                onChange={toggleCategory}
              />
              iPad
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value="Laptop"
                onChange={toggleCategory}
              />
              Laptop
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value="Watch"
                onChange={toggleCategory}
              />
              Watch
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value="Airpods"
                onChange={toggleCategory}
              />
              Airpods
            </p>
            <p className="flex gap-2">
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

        {/* SubCategory Filter */}
        <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className="mb-3 text-sm font-medium">TYPE</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value="Pro"
                onChange={toggleSubCategory}
              />
              Pro
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value="Plus"
                onChange={toggleSubCategory}
              />
              Plus
            </p>
            <p className="flex gap-2">
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

      {/* Right Side */}
      <div className="flex-1">
        <div className="flex justify-between items-center text-base sm:text-2xl mb-4">
          <Title text1="All" text2="Collection" />
          <div className="flex items-center gap-3">
            <button
              onClick={refreshProducts}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </button>
            <select
              onChange={(e) => setSortType(e.target.value)}
              className="select select-bordered text-sm"
            >
              <option value="relavent">Sort by: Relevant</option>
              <option value="low-high">Sort by: Low to High</option>
              <option value="high-low">Sort by: High to Low</option>
            </select>
          </div>
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-gray-600">Loading products...</p>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {filterProducts.map((item) => (
            <ProductItems key={item._id} id={item._id} image={item.image} name={item.name} price={item.price} />
          ))}
        </div>

        {/* No Products Message */}
        {!isLoading && filterProducts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Collection