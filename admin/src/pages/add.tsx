import React from 'react'
import { assets } from '../assets/assets'

function add() {
  return (
    <>
      <form className='flex flex-col w-full items-start gap3'>
        <div>
          <p className='mb-2'>Upload Image</p>
          <div className='flex gap-2'>
            <label htmlFor='image1' >
              <img className='w-20' src={assets.upload_area} alt='' />
              <input type='file' id='image1' hidden />
            </label>
            <label htmlFor='image2' >
              <img className='w-20' src={assets.upload_area} alt='' />
              <input type='file' id='image2' hidden />
            </label>
            <label htmlFor='image3' >
              <img className='w-20' src={assets.upload_area} alt='' />
              <input type='file' id='image3' hidden />
            </label>
            <label htmlFor='image4' >
              <img className='w-20' src={assets.upload_area} alt='' />
              <input type='file' id='image4' hidden />
            </label>
          </div>
        </div>
        <div className='w-full'>
          <p className='mb-2'>Product name</p>
          <input className='w-full max-w-[500px] px-3 py-2 ' type='text' placeholder='Type here' required />
        </div>
        <div className='w-full'>
          <p className='mb-2'>Product description</p>
          <input className='w-full max-w-[500px] px-3 py-2 ' type='text' placeholder='Write content here' required />
        </div>
        <div className=" flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
          <div className="">
            <p className='mb-2'>Product category</p>
            <select className="w-full px-3 py-2" name="" id="">
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
            <select className="w-full px-3 py-2" name="" id="">
              <option value="Plus">Plus</option>
              <option value="Pro">Pro</option>
              <option value="Ultra">Ultra</option>

            </select>

          </div>
          <div className="">
            <p className='mb-2'>Product Price</p>
            <input className='w-full px-3 py-2 sm:w-[120px]' type="Number" placeholder='100' />
          </div>
        </div>
        <div>
          <p className='mb-2'> Product Color</p>
          <div className="flex gap-3">
            <div><p className='bg-slate-200 px-3 py-2 cursor-pointer' >Black</p></div>
            <div><p className='bg-slate-200 px-3 py-2 cursor-pointer'>Black Titanium</p></div>
            <div><p className='bg-slate-200 px-3 py-2 cursor-pointer'>Desert Titanium</p></div>
            <div><p className='bg-slate-200 px-3 py-2 cursor-pointer'>Gold</p></div>
            <div><p className='bg-slate-200 px-3 py-2 cursor-pointer'>Pink</p></div>
            <div><p className='bg-slate-200 px-3 py-2 cursor-pointer'>Silver</p></div>
            <div><p className='bg-slate-200 px-3 py-2 cursor-pointer'>Teal</p></div>
            <div><p className='bg-slate-200 px-3 py-2 cursor-pointer'>Ultramarine</p></div>
            <div><p className='bg-slate-200 px-3 py-2 cursor-pointer'>White</p></div>
            <div><p className='bg-slate-200 px-3 py-2 cursor-pointer'>Yellow</p></div>


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

export default add