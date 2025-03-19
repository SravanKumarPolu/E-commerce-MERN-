import { v2 as cloudinary } from 'cloudinary'
import productModel from "../models/productModel.js"
const addProduct=async(req,res)=>{
try {
  const { name, description, price, category, subCategory, color, bestseller } = req.body;
  const image1 = req.files.image1 && req.files.image1[0];
  const image2 = req.files.image2 && req.files.image2[0];
  const image3 = req.files.image3 && req.files.image3[0];
  const image4 = req.files.image4 && req.files.image4[0];
  const images=[image1,image2,image3,image4].filter((item)=>item !== undefined)
  let imagesUrl = await Promise.all(
    images.map(async (item) => {
      let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
      return result.secure_url
    })
  )
console.log(name, description, price, category, subCategory, color, bestseller )
console.log(imagesUrl)
const productData = {
  name,
  description,
  price: Number(price),
  category,
  subCategory,
  color: typeof color === "string" ? color.split(",") : color, // Ensure it's an array
  bestseller: bestseller === "true" ? true : false,
  image: imagesUrl,
  date: Date.now()
};
console.log(productData )
  const product= new productModel(productData );
  await product.save();

res.json({ success: true, message: "Product Added" })
} catch (error) {
  
}
}
const singleProduct=async(req,res)=>{

}
const removeProduct=async(req,res)=>{

}
//function for list product
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products })

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message })

  }


}


export { addProduct, singleProduct, removeProduct, listProducts }