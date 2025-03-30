import { assets } from '../assets/assets';
import { useState } from 'react';

interface AddProps {
  token: string;
}

const Add: React.FC<AddProps> = () => {
  const [image1, setImage1] = useState<File | null>(null);
  const [image2, setImage2] = useState<File | null>(null);
  const [image3, setImage3] = useState<File | null>(null);
  const [image4, setImage4] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [setPrice] = useState('');
  const [category, setCategory] = useState("iPhone");
  const [subCategory, setSubCategory] = useState("Pro");
  const [bestseller, setBestseller] = useState(false);
  const [color, setColor] = useState<string[]>([]);

  const colorOptions = ["Black", "Black Titanium", "Desert Titanium", "Gold", "Pink", "Silver", "Teal", "Ultramarine", "White", "Yellow"];

  return (
    <form className="w-full max-w-4xl mx-auto mt-8 space-y-6">
      {/* Upload */}
      <div>
        <label className="font-semibold text-lg mb-2 block">Upload Images</label>
        <div className="flex gap-3">
          {[image1, image2, image3, image4].map((img, i) => (
            <label key={i} htmlFor={`image${i + 1}`} className="cursor-pointer">
              <img
                src={img ? URL.createObjectURL(img) : assets.upload_area}
                className="w-24 h-24 object-cover border rounded-md"
                alt="upload"
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

      {/* Inputs */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Product Name</span>
        </label>
        <input
          type="text"
          placeholder="Enter product name"
          className="input input-bordered w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Product Description</span>
        </label>
        <input
          type="text"
          placeholder="Description"
          className="input input-bordered w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Category</span>
          </label>
          <select
            className="select select-bordered"
            onChange={(e) => setCategory(e.target.value)}
            value={category}
          >
            <option>Watch</option>
            <option>iPad</option>
            <option>iPhone</option>
            <option>Laptop</option>
            <option>Airpods</option>
            <option>TV</option>
          </select>
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Sub Category</span>
          </label>
          <select
            className="select select-bordered"
            onChange={(e) => setSubCategory(e.target.value)}
            value={subCategory}
          >
            <option>Plus</option>
            <option>Pro</option>
            <option>Ultra</option>
          </select>
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Price</span>
          </label>
          <input
            type="number"
            className="input input-bordered"
            placeholder="100"
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
      </div>

      {/* Color Selection */}
      <div>
        <label className="block font-semibold mb-2">Select Colors</label>
        <div className="flex flex-wrap gap-3">
          {colorOptions.map((col) => (
            <div
              key={col}
              onClick={() =>
                setColor((prev) =>
                  prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
                )
              }
            >
              <p
                className={`badge px-4 py-2 cursor-pointer ${color.includes(col) ? "badge-primary" : "badge-ghost"
                  }`}
              >
                {col}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bestseller */}
      <div className="form-control">
        <label className="label cursor-pointer flex gap-3">
          <input
            type="checkbox"
            className="checkbox"
            checked={bestseller}
            onChange={() => setBestseller((prev) => !prev)}
          />
          <span className="label-text">Add to bestseller</span>
        </label>
      </div>

      {/* Submit */}
      <button type="submit" className="btn btn-neutral w-32">
        ADD
      </button>
    </form>
  );
};

export default Add;
