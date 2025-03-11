import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js"
import validator from 'validator'

const createToken=(id)=>{
  return jwt.sign({id},process.env.JWT_SECRET)
}
const loginUser=async(req,res)=>{

}
//Route for user register
const registerUser=async(req,res)=>{
try {
  const {name,email,password}=req.body
  //checking user already exists or not
  const exist=await userModel.findOne({email})

  if(exist){
  return res.json({success:false,message:"Already user exists"})
  }
  //validating email formate and strong password
  if(!validator.isEmail(email)){
    return res.json({success:false,message:"Please enter a valid Email"})
  }
  if(password.length<8){
    return res.json({success:"false",message:"Please enter  a strong Password"})
  }
  //hashing user password
  const salt= await bcrypt.genSalt(10);
  const hashedPassword=await bcrypt.hash(password,salt)
  const newUser= new userModel({
    name,email,password:hashedPassword
  })
  const user=  await  newUser.save();
  const token=createToken(user._id)
  res.json({success:true,token})

} catch (error) {
  console.log(error);
  res.json({success:false,message:error.message})
}
}


const adminLogin=async(req,res)=>{

}
export {adminLogin,loginUser,registerUser}