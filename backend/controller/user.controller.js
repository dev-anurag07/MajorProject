import jwt from "jsonwebtoken";
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import cloudinary from "../config/cloudinary.js"
import fs from "fs"
import upload from "../middleware/multer.middleware.js";

const generateaccesstoken =(userId)=>{
    return jwt.sign({userId},process.env.ACCESS_SECRET_TOKEN,{expiresIn:"30m"});
};

const generaterefreshtoken = (userId)=>{
    return jwt.sign({userId},process.env.REFRESH_SECRET_TOKEN,{expiresIn:"7d"});
}

export const getAddresses = async(req,res)=>{
    try {
        
        const user = await User.findById(req.user.id);
        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        res.status(200).json(user.addresses);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}







export const addAvatar = async (req,res)=>{
    try {
        // we do not destruct here as we directly haave req.file 
        //checking file exist or not 
        if (!req.file){
            res.status(400).json({message:"please upload a image file"});
        }
       
       const result = await cloudinary.uploader.upload(req.file.path,{
        folder:"user_avatar",// folder name on cloudinary
    })
                    
        const updateUser = await User.findByIdAndUpdate(req.user.id,{ //Model.findByIdAndUpdate(id, updateData, options)
            avatar: result.secure_url},
            {new:true},
        ).select("-password");

        
        if (fs.existsSync(req.file.path)) 
            {
            fs.unlinkSync(req.file.path);
        }

        res.status(200).json({
            success:true,
            avatar: updateUser.avatar,
        })


    } catch (error) {
        if(req.file && fs.existsSync(req.file.path)){// when internet fails we unlink the file so that it remove from folder
            fs.unlinkSync(req.file.path);
        }
        res.status(400).json({message: "Upload failed ", error:error.message})
    }
}









export const addAddress =async(req,res)=>{
    try {
        const {label, address,pincode,city,state,long,lat}=req.body;

        if(long == undefined|| lat==undefined || isNaN(Number(long)||isNaN(Number(lat)))){
            return res.status(400).json({message:"Pls Provide the Location correctly from map"})
        }

        const updateUser = await User.findByIdAndUpdate(req.user.id,{
            $push:{
                addresses:{
                    label:label||"Home",
                    address,
                    pincode,
                    city,
                    state,

                    location:{
                        type:"Point",
                        coordinates:[Number(long),Number(lat)],// convert numberstring to num and reject string like bhopal
                    }
                }
            }
           
        }, {new:true}//return updated document , this for returning document because this funtion just update
    ).select("-password");//this is for returning document but not password

    res.status(200).json({
        success:true,
        message:"Address Added Successfully",
        addresses:updateUser.addresses,
    })
    } catch (error) {
        res.status(500).json({message:"Error in Adding address"});
    }
}









export const registerUser =async(req,res)=>{
    try {
        const {name, email,password,role,phoneNumber}= req.body;
         if(!name||!email||!password||!role||!phoneNumber){
      return res.status(400).json({message:"All fields are Required"});
         }

const Userexist = await User.findOne({email});
if(Userexist){
    return res.status(400).json({message:"User already exist"});
}
const hashPassword = await bcrypt.hash(password,10);


const user =new User({
   name,
   email,
   password:hashPassword,
   role,
   phoneNumber,
})

await user.save();

return res.status(201).json({
    success:true,
    message:"User Registered Successfully Pls Proceed to Login Page"
});


    } catch (error) {
        console.log(error.message);
       return res.status(500).json({message:"registration failed",error:error.message});
    }
}







export const loginUser =async(req,res)=>{
try {
    
const {email,password}=req.body;

const user= await User.findOne({email});

if(!user){
    return res.status(400).json({message:"Invalid email or password"});
}

const Match = await bcrypt.compare(password,user.password);
if(!Match){
   return res.status(400).json({message:"Incorrect Password"});
}

const AccessToken = generateaccesstoken(user._id);
const RefreshToken= generaterefreshtoken(user._id);

//send refresh token in cookies 
res.cookie("RefreshToken",RefreshToken,{
    httpOnly:true,
    secure:true,
    sameSite:true,
})

//send access token and user deatils for fast ui changes
res.status(200).json({
    message:"User login Successfully",
    AccessToken,
    user:{
    id:user._id,
    email:user.email,
    name:user.name,
    role:user.role,
}
})
} catch (error) {
    res.status(500).json({message:"Server error",error:error.message})
}
}



export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


export const updateUserProfile = async (req, res) => {
   
  try {
    const { name, phoneNumber } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    let imageUrl = user.image;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "medicine-finder",//cloudinary folder
      });

      fs.unlinkSync(req.file.path);

      imageUrl = result.secure_url;
    }

    user.name = name || user.name;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.image = imageUrl;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};