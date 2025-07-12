import { useEffect, useState, useCallback } from "react";
import ProductItems from "../components/ProductItems";
import Title from "../components/Title";
import { assets } from "../assets/assets"
import { useShopContext } from "../context/ShopContext";

const Collection = () => {
  const { products, search, showSearch, loading, error } = useShopContext();
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [sortType, setSortType] = useState<string>('relavent');
  const [filterProducts, setFilterProducts] = useState<typeof products>([]);
  const [category, setCategory] = useState<string[]>([]);
  const [subCategory, setSubCategory] = useState<string[]>([]);

  // Get unique categories and subcategories from products
  const availableCategories = [...new Set(products.map(p => p.category))].filter(Boolean);
  const availableSubCategories = [...new Set(products.map(p => p.subCategory))].filter(Boolean);

  const toggleCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (category.includes(e.target.value)) {
      setCategory(prev => prev.filter(item => item !== e.target.value))
    }
    else {
      setCategory(prev => [...prev, e.target.value])
    }
  }

  const toggleSubCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory(prev => prev.filter(item => item !== e.target.value))
    }
    else {
      setSubCategory(prev => [...prev, e.target.value])
    }
  }

  const applyFilter = useCallback(() => {
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
    setFilterProducts(productsCopy)
  }, [products, search, showSearch, category, subCategory]);

  useEffect(() => {
    applyFilter();
  }, [applyFilter]);

  const sortProduct = useCallback(() => {
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
  }, [filterProducts, sortType, applyFilter]);

  useEffect(() => {
    sortProduct();
  }, [sortProduct]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 ">
      <div className="w-full sm:w-72 bg-base-200 p-4 rounded-2xl shadow-md">
        <div className="collapse sm:collapse-open bg-base-100 rounded-lg">
          <input
            type="checkbox"
            className="sm:hidden"
            checked={showFilter}
            onChange={() => setShowFilter(!showFilter)}
          />
          <div className="collapse-title text-lg font-semibold cursor-pointer flex items-center justify-between">
            Filter Options
            <img
              src={assets.dropdown_icon}
              className={`h-3 transition-transform duration-200 ${
                showFilter ? "rotate-180" : ""
              } sm:hidden`}
              alt="Toggle"
            />
          </div>

          <div className="collapse-content space-y-6 mt-2">
            {/* Category Filter */}
            {availableCategories.length > 0 && (
              <div className="bg-base-100 border border-base-300 rounded-lg p-4 shadow-sm">
                <h3 className="text-sm font-medium mb-2">Categories</h3>
                <div className="form-control space-y-2">
                  {availableCategories.map((item) => (
                    <label key={item} className="label cursor-pointer justify-start gap-2">
                      <input
                        type="checkbox"
                        value={item}
                        onChange={toggleCategory}
                        className="checkbox checkbox-sm checkbox-primary"
                      />
                      <span className="label-text text-sm">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* SubCategory Filter */}
            {availableSubCategories.length > 0 && (
              <div className="bg-base-100 border border-base-300 rounded-lg p-4 shadow-sm">
                <h3 className="text-sm font-medium mb-2">Type</h3>
                <div className="form-control space-y-2">
                  {availableSubCategories.map((type) => (
                    <label key={type} className="label cursor-pointer justify-start gap-2">
                      <input
                        type="checkbox"
                        value={type}
                        onChange={toggleSubCategory}
                        className="checkbox checkbox-sm checkbox-secondary"
                      />
                      <span className="label-text text-sm">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1">
        <div className="flex justify-between items-center text-base sm:text-2xl mb-4">
          <Title text1="All" text2="Collection" />
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="select select-bordered text-sm"
          >
            <option value="relavent">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>
        
        {/* Products Grid */}
        {filterProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
            {filterProducts.map((item) => (
              <ProductItems 
                key={item._id} 
                id={item._id} 
                image={item.image} 
                name={item.name} 
                price={item.price} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Collection