import { assets } from '../assets/assets'
import { useState } from 'react';
interface AddProps {
  token: string;
}
const Add: React.FC<AddProps> = () => {
  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState("iPhone")
  const [subCategory, setSubCategory] = useState("Pro")
  const [bestseller, setBestseller] = useState(false)
  const [color, setColor] = useState<string[]>([]);

  return (
    <>
      <form className='flex flex-col w-full items-start gap3'>
        <div>
          <p className='mb-2'>Upload Image</p>
          <div className='flex gap-2'>
            <label htmlFor='image1' >
              <img className='w-20' src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt='' />
              <input onChange={(e) => setImage1(e.target.files[0])} type='file' id='image1' hidden />
            </label>
            <label htmlFor='image2' >
              <img className='w-20' src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt='' />
              <input onChange={(e) => setImage2(e.target.files[0])} type='file' id='image2' hidden />
            </label>
            <label htmlFor='image3' >
              <img className='w-20' src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt='' />
              <input onChange={(e) => setImage3(e.target.files[0])} type='file' id='image3' hidden />
            </label>
            <label htmlFor='image4' >
              <img className='w-20' src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt='' />
              <input onChange={(e) => setImage4(e.target.files[0])} type='file' id='image4' hidden />
            </label>
          </div>
        </div>
        <div className='w-full'>
          <p className='mb-2'>Product name</p>
          <input onChange={(e) => setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2 ' type='text' placeholder='Type here' required />
        </div>
        <div className='w-full'>
          <p className='mb-2'>Product description</p>
          <input onChange={(e) => setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2 ' type='text' placeholder='Write content here' required />
        </div>
        <div className=" flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
          <div className="">
            <p className='mb-2'>Product category</p>
            <select onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2" name="" id="">
              <option value="Watch">Watch</option>
              <option value="iPad">iPad</option>
              <option value="iPhone">iPhone</option>
              <option value="Laptop">Laptop</option>
              <option value="Airpods">Airpods</option>
              <option value="Tv">Tv</option>
            </select>

          </div>
          <div className="">
            <p className='mb-2'> Sub category</p>
            <select onChange={(e) => setSubCategory(e.target.value)} className="w-full px-3 py-2" name="" id="">
              <option value="Plus">Plus</option>
              <option value="Pro">Pro</option>
              <option value="Ultra">Ultra</option>

            </select>

          </div>
          <div className="">
            <p className='mb-2'>Product Price</p>
            <input onChange={(e) => setPrice(e.target.value)} className='w-full px-3 py-2 sm:w-[120px]' type="Number" placeholder='100' />
          </div>
        </div>
        <div>
          <p className='mb-2'> Product Color</p>
          <div className="flex gap-3">
            <div onClick={() => setColor(prev => prev.includes("Black") ? prev.filter(item => item !== "Black") : [...prev, "Black"])}>
              <p className={`shadow-md ${color.includes("Black") ? "bg-slate-300" : "bg-slate-100"} px-3 py-1 cursor-pointer`} >Black</p></div>
            <div onClick={() => setColor(prev => prev.includes("Black Titanium") ? prev.filter(item => item !== "Black Titanium") : [...prev, "Black Titanium"])}>
              <p className={`shadow-md ${color.includes("Black Titanium") ? "bg-slate-300" : "bg-slate-100"} px-3 py-1 cursor-pointer`}>Black Titanium</p></div>
            <div onClick={() => setColor(prev => prev.includes("Desert Titanium") ? prev.filter(item => item !== "Desert Titanium") : [...prev, "Desert Titanium"])}>
              <p className={`shadow-md ${color.includes("Desert Titanium") ? "bg-slate-300" : "bg-slate-100"} px-3 py-1 cursor-pointer`}>Desert Titanium</p></div>
            <div onClick={() => setColor(prev => prev.includes("Gold") ? prev.filter(item => item !== "Gold") : [...prev, "Gold"])}>
              <p className={`shadow-md ${color.includes("Gold") ? "bg-slate-300" : "bg-slate-100"} px-3 py-1 cursor-pointer`}>Gold</p></div>
            <div onClick={() => setColor(prev => prev.includes("Pink") ? prev.filter(item => item !== "Pink") : [...prev, "Pink"])}>
              <p className={`shadow-md ${color.includes("Pink") ? "bg-slate-300" : "bg-slate-100"} px-3 py-1 cursor-pointer`}>Pink</p></div>
            <div onClick={() => setColor(prev => prev.includes("Silver") ? prev.filter(item => item !== "Silver") : [...prev, "Silver"])}>
              <p className={`shadow-md ${color.includes("Silver") ? "bg-slate-300" : "bg-slate-100"} px-3 py-1 cursor-pointer`}
              >Silver</p></div>
            <div onClick={() => setColor(prev => prev.includes("Teal") ? prev.filter(item => item !== "Teal") : [...prev, "Teal"])}>
              <p className={`shadow-md ${color.includes("Teal") ? "bg-slate-300" : "bg-slate-100"} px-3 py-1 cursor-pointer`}>Teal</p></div>
            <div onClick={() => setColor(prev => prev.includes("Ultramarine") ? prev.filter(item => item !== "Ultramarine") : [...prev, "Ultramarine"])}>
              <p className={`shadow-md ${color.includes("Ultramarine") ? "bg-slate-300" : "bg-slate-100"} px-3 py-1 cursor-pointer`}>Ultramarine</p></div>
            <div onClick={() => setColor(prev => prev.includes("White") ? prev.filter(item => item !== "White") : [...prev, "White"])}>
              <p className={`shadow-md ${color.includes("White") ? "bg-slate-300" : "bg-slate-100"} px-3 py-1 cursor-pointer`}>White</p></div>
            <div onClick={() => setColor(prev => prev.includes("Yellow") ? prev.filter(item => item !== "Yellow") : [...prev, "Yellow"])}>
              <p className={`shadow-md ${color.includes("Yellow") ? "bg-slate-300" : "bg-slate-100"} px-3 py-1 cursor-pointer`}>Yellow</p></div>


          </div>
        </div>

        <div className=" flex gap-2 mt-2">
          <input type="checkbox" id="bestseller" />
          <label className="cursor-pointer" htmlFor="bestseller"> Add to bestseller</label>
        </div>
        <button type="submit" className="w-28 py-3 mt-4 cursor-pointer bg-black text-white">ADD</button>
      </form>
    </>
  )
}

export default Add;