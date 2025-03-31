import { assets } from '../assets/assets';
import axios from 'axios';
import { backendUrl } from '../App';
import { useState } from 'react';

interface AddProps {
  token: string;
}
const Add: React.FC<AddProps> = ({ token }) => {
  const [image1, setImage1] = useState<File | null>(null);
  const [image2, setImage2] = useState<File | null>(null);
  const [image3, setImage3] = useState<File | null>(null);
  const [image4, setImage4] = useState<File | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('iPhone');
  const [subCategory, setSubCategory] = useState('Pro');
  const [bestseller, setBestseller] = useState(false);
  const [color, setColor] = useState<string[]>([]);

  const colorOptions = ["Black", "Black Titanium", "Desert Titanium", "Gold", "Pink", "Silver", "Teal", "Ultramarine", "White", "Yellow"];
  const onSubmitHandler = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("description", description)
      formData.append("price", price)
      formData.append("category", category)
      formData.append("subCategory", subCategory)
      formData.append("bestseller", JSON.stringify(bestseller))
      formData.append("color", JSON.stringify(color))
      if (image1) formData.append('image1', image1);
      if (image2) formData.append('image2', image2);
      if (image3) formData.append('image3', image3);
      if (image4) formData.append('image4', image4);
      const response = await axios.post(backendUrl + "/api/product/add", formData, { headers: { token }, })
      console.log(response)
    } catch (error) {
      console.log(error)

    }
  }
  return (
    <form onSubmit={onSubmitHandler} className="max-w-5xl w-full mx-auto mt-10 px-4 sm:px-6 lg:px-8 space-y-8 text-gray-700">
      {/* Title */}
      <h2 className="text-2xl font-bold mb-2">Add New Product</h2>

      {/* Image Upload */}
      <div>
        <label className="block mb-2 font-medium">Upload Images</label>
        <div className="flex flex-wrap gap-4">
          {[image1, image2, image3, image4].map((img, i) => (
            <label
              key={i}
              htmlFor={`image${i + 1}`}
              className="relative w-24 h-24 border-2 border-dashed rounded-lg cursor-pointer flex items-center justify-center overflow-hidden hover:shadow-md transition"
            >
              <img
                src={img ? URL.createObjectURL(img) : assets.upload_area}
                alt={`upload ${i + 1}`}
                className="w-full h-full object-cover"
              />
              <input
                type="file"
                id={`image${i + 1}`}
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  if (i === 0) setImage1(file);
                  if (i === 1) setImage2(file);
                  if (i === 2) setImage3(file);
                  if (i === 3) setImage4(file);
                }}
              />
            </label>
          ))}
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="block mb-1 font-medium">Product Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Type product name"
          className="w-full max-w-lg border border-gray-300 px-4 py-2 rounded-md focus:outline-none hover:shadow-md focus:shadow-md"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block mb-1 font-medium">Product Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write product description"
          className="w-full max-w-lg border border-gray-300 px-4 py-2 rounded-md focus:outline-none  hover:shadow-md focus:shadow-md"
        />
      </div>

      {/* Category, SubCategory, Price */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block mb-1 font-medium">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none  hover:shadow-md focus:shadow-md"
          >
            <option>Watch</option>
            <option>iPad</option>
            <option>iPhone</option>
            <option>Laptop</option>
            <option>Airpods</option>
            <option>TV</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Sub Category</label>
          <select
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none  hover:shadow-md focus:shadow-md"
          >
            <option>Plus</option>
            <option>Pro</option>
            <option>Ultra</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Price</label>
          <input
            type="number"
            placeholder="100"
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none  hover:shadow-md focus:shadow-md"
          />
        </div>
      </div>

      {/* Color Selection */}
      <div>
        <label className="block mb-2 font-medium">Colors</label>
        <div className="flex flex-wrap gap-2">
          {colorOptions.map((col) => (
            <button
              key={col}
              type="button"
              onClick={() =>
                setColor((prev) =>
                  prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
                )
              }
              className={`px-3 py-1 rounded-md border text-sm ${color.includes(col)
                ? 'bg-gray-800 text-white border-gray-800 focus:outline-none  hover:shadow-md focus:shadow-md'
                : 'bg-gray-100 text-gray-700 border-gray-300'
                } transition`}
            >
              {col}
            </button>
          ))}
        </div>
      </div>

      {/* Bestseller Checkbox */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="bestseller"
          checked={bestseller}
          onChange={() => setBestseller((prev) => !prev)}

          className="accent-black"
        />
        <label htmlFor="bestseller" className="text-sm cursor-pointer">
          Add to Bestseller
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-900 transition w-32 focus:outline-none  hover:shadow-md focus:shadow-md"
      >
        ADD
      </button>
    </form>
  );
};

export default Add;
