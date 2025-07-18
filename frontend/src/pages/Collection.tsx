import { useEffect, useState } from "react";
import ProductItems from "../components/ProductItems";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import { useShopContext } from "../context/ShopContext";
import useCategories from "../hooks/useCategories";
import { motion, AnimatePresence } from "framer-motion";

const Collection = () => {
  const { products, search, showSearch, refreshProducts, isLoading } = useShopContext();
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [sortType, setSortType] = useState<string>('relevant');

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

  const [showBestsellers, setShowBestsellers] = useState<boolean>(false);

  const applyFilter = () => {
    let productsCopy = products.slice()
    if (showSearch && search) {
      productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    }
    if (category.length > 0) {
      productsCopy = productsCopy.filter(item => category.includes(item.category))
    }
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory))
    }
    if (showBestsellers) {
      productsCopy = productsCopy.filter(item => item.bestseller === true)
    }
    setFilterProducts(productsCopy)
  }
  
  useEffect(() => {
    applyFilter();
  }, [category, search, showSearch, subCategory, showBestsellers, products])

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

  const clearFilters = () => {
    setCategory([]);
    setSubCategory([]);
    setShowBestsellers(false);
    setSortType('relevant');
  }

  const activeFiltersCount = category.length + subCategory.length + (showBestsellers ? 1 : 0);

  // Get all unique subcategories from all categories
  const allSubCategories = categories.flatMap(cat => 
    cat.subCategories.filter(sub => sub.isActive).map(sub => sub.name)
  );

  return (
    <div className="space-y-16 sm:space-y-20 lg:space-y-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Page Header */}
        <motion.div 
          className="mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
            <div>
              <Title text1="All" text2="Products" />
              <p className="text-sm sm:text-base text-gray-600 mt-2">
                Discover our premium collection of Apple products
              </p>
            </div>
            
            {/* Active Filters Display */}
            {activeFiltersCount > 0 && (
              <motion.div 
                className="flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-sm text-gray-600">
                  {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} active
                </span>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Clear all
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Filter Sidebar */}
          <motion.div 
            className="lg:w-64"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
              <motion.button
                onClick={() => setShowFilter(!showFilter)}
                className="w-full flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-md"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <span className="font-semibold text-gray-800">
                    Filters
                    {activeFiltersCount > 0 && (
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full ml-2">
                        {activeFiltersCount}
                      </span>
                    )}
                  </span>
                </div>
                <motion.img
                  className={`w-4 h-4 transition-transform duration-300 ${showFilter ? 'rotate-180' : ''}`}
                  src={assets.dropdown_icon}
                  alt="Toggle filters"
                />
              </motion.button>
            </div>

            {/* Filter Content */}
            <AnimatePresence>
              {(showFilter || window.innerWidth >= 1024) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="lg:block"
                >
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    {/* Categories Filter */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
                        <div className="w-6 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                        Categories
                      </h3>
                      {categoriesLoading ? (
                        <div className="space-y-3">
                          {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="flex items-center gap-3 p-2">
                              <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                              <div className="h-4 bg-gray-200 rounded animate-pulse flex-1"></div>
                            </div>
                          ))}
                        </div>
                      ) : categoriesError ? (
                        <div className="text-red-500 text-sm">Failed to load categories</div>
                      ) : (
                        <div className="space-y-3">
                          {categories
                            .filter(cat => cat.isActive)
                            .sort((a, b) => a.sortOrder - b.sortOrder)
                            .map((cat) => (
                            <motion.label
                              key={cat._id}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                              whileHover={{ x: 4 }}
                            >
                              <input
                                type="checkbox"
                                value={cat.name}
                                onChange={toggleCategory}
                                checked={category.includes(cat.name)}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border border-gray-300 rounded focus:ring-blue-500"
                              />
                              <span className="text-sm font-medium text-gray-700">
                                {cat.name}
                                {category.includes(cat.name) && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-2 h-2 bg-blue-600 rounded-full ml-2"
                                  />
                                )}
                              </span>
                            </motion.label>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Sub Categories Filter */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
                        <div className="w-6 h-1 bg-gradient-to-r from-green-600 to-blue-600 rounded-full"></div>
                        Sub Categories
                      </h3>
                      {categoriesLoading ? (
                        <div className="space-y-3">
                          {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="flex items-center gap-3 p-2">
                              <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                              <div className="h-4 bg-gray-200 rounded animate-pulse flex-1"></div>
                            </div>
                          ))}
                        </div>
                      ) : categoriesError ? (
                        <div className="text-red-500 text-sm">Failed to load subcategories</div>
                      ) : (
                        <div className="space-y-3">
                          {allSubCategories
                            .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
                            .map((subCat) => (
                            <motion.label
                              key={subCat}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                              whileHover={{ x: 4 }}
                            >
                              <input
                                type="checkbox"
                                value={subCat}
                                onChange={toggleSubCategory}
                                checked={subCategory.includes(subCat)}
                                className="w-4 h-4 text-green-600 bg-gray-100 border border-gray-300 rounded focus:ring-green-500"
                              />
                              <span className="text-sm font-medium text-gray-700">
                                {subCat}
                                {subCategory.includes(subCat) && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-2 h-2 bg-green-600 rounded-full ml-2"
                                  />
                                )}
                              </span>
                            </motion.label>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Bestsellers Filter */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
                        <div className="w-6 h-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-full"></div>
                        Bestsellers
                      </h3>
                      <motion.label
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                        whileHover={{ x: 4 }}
                      >
                        <input
                          type="checkbox"
                          checked={showBestsellers}
                          onChange={(e) => setShowBestsellers(e.target.checked)}
                          className="w-4 h-4 text-red-600 bg-gray-100 border border-gray-300 rounded focus:ring-red-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Show only bestsellers
                        </span>
                        {showBestsellers && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 bg-red-600 rounded-full ml-2"
                          />
                        )}
                      </motion.label>
                    </div>

                    {/* Clear Filters Button */}
                    {activeFiltersCount > 0 && (
                      <motion.button
                        onClick={clearFilters}
                        className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Clear All Filters
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Main Content */}
          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Controls Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {filterProducts.length} products
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <motion.button
                    onClick={refreshProducts}
                    disabled={isLoading}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium shadow-md hover:shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Refreshing...
                      </div>
                    ) : (
                      'Refresh'
                    )}
                  </motion.button>
                  
                  <select
                    onChange={(e) => setSortType(e.target.value)}
                    value={sortType}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white shadow-sm"
                  >
                    <option value="relevant">Sort by: Relevant</option>
                    <option value="low-high">Sort by: Low to High</option>
                    <option value="high-low">Sort by: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                <p className="mt-4 text-gray-600 font-medium">Loading products...</p>
              </motion.div>
            )}

            {/* Products Grid */}
            {!isLoading && (
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                {filterProducts.map((item, index) => (
                  <motion.div
                    key={item._id}
                    className="h-full min-h-[500px] flex"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <ProductItems 
                      id={item._id} 
                      image={item.image} 
                      name={item.name} 
                      price={item.price} 
                      bestseller={item.bestseller}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* No Products Message */}
            {!isLoading && filterProducts.length === 0 && (
              <motion.div 
                className="text-center py-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12H3" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
                <motion.button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Clear Filters
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Collection; 