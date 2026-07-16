import Inventory from "../models/inventory.model.js";
import Pharmacy from "../models/pharmacy.model.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import redisClient from "../config/redis.js";

export const addMedicine = async (req, res) => {
  console.log(req.file);
  try {
    const {
      medicineName,
      manufacturer,
      price,
      stockQuantity,
      category,
      expiryDate,
      isAvailable
    } = req.body;

    
    if (!medicineName || !price || !stockQuantity) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    
    const pharmacy = await Pharmacy.findOne({ owner: req.user.id });

    if (!pharmacy) {
      return res.status(404).json({
        message: "Pharmacy not found for this user"
      });
    }

    let imageurl = "";
    if(req.file){
      const result = await cloudinary.uploader.upload(req.file.path,{
        folder: "medicine-finder",
      });

     if(req.file){
      fs.unlinkSync(req.file.path);
     }
      

      imageurl = result.secure_url;
    }
   
    const newInventory = await Inventory.create({
      PharmacyId: pharmacy._id, 
      medicineName,
      manufacturer,
      price,
      stockQuantity,
      category,
      expiryDate,
       image:imageurl,
      isAvailable:
        isAvailable !== undefined ? isAvailable : stockQuantity > 0,
       
    });

    await redisClient.del(`inventory:${pharmacy._id}`);

    res.status(201).json({
      success: true,
      message: "Medicine added successfully",
      data: newInventory,
    });


  } catch (error) {
    console.log(error);
    console.log(error.message);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};





export const UpdateMedicine =async(req,res)=>{
    try {
        const{medicineId}=req.params;
        const {price, stockQuantity,isAvailable,manufacturer,category}= req.body;
        

        const medicine = await Inventory.findById(medicineId);

        let imageurl = medicine.image;

        if(req.file){
          const result = await cloudinary.uploader.upload(req.file.path,{
              folder:"medicine-finder",
          });

          fs.unlinkSync(req.file.path);
          imageurl =result.secure_url;
        }

        if(!medicine){
            return res.status(400).json({message:"Medicine Not Found"});
        }

        const pharmacy = await Pharmacy.findById(medicine.PharmacyId);
        if(!pharmacy || pharmacy.owner.toString()!==req.user.id){
            return res.status(403).json({message:"Unauthorized: You do not have permission to update this pharmacy's stock"})
        }

      const updatedmedicine = await Inventory.findByIdAndUpdate(medicineId,{
        price,
        stockQuantity,
        manufacturer,
        category,
        image:imageurl,
        isAvailable:isAvailable!==undefined?isAvailable:(stockQuantity!==undefined)?stockQuantity>0:medicine.isAvailable,
      },{new:true,runValidators:true})


      await redisClient.del(`inventory:${pharmacy._id}`);

         res.status(200).json({
            success: true,
            message: "Medicine updated successfully",
            data: updatedmedicine
        });

    } catch (error) {

        res.status(500).json({ 
            message: "Server Error during update", 
            error: error.message 
        });


    }
}




export const deleteMedicine = async (req,res)=>{
    try {
        const{medicineId}= req.params
         
        const medicine = await Inventory.findById(medicineId);

        if(!medicine){
            return res.status(404).json({message:"medicine not found"});
        }

        const pharmacy = await Pharmacy.findById(medicine.PharmacyId);

            if(pharmacy.owner.toString()!==req.user.id){
                return res.status(403).json({message:"Unauthorized to delete this item"});
            }

            await Inventory.findByIdAndDelete(medicineId);

            await redisClient.del(`inventory:${pharmacy._id}`);
            res.status(200).json({ success: true, message: "Medicine removed from inventory" })
        }

     catch (error) {
        res.status(500).json({message:error.message})
    }
}


export const getMyInventory = async (req, res) => {
  console.log("getmyinventory called");
  try {
    const pharmacy = await Pharmacy.findOne({ owner: req.user.id });

    if (!pharmacy) {
      return res.status(404).json({
        message: "Pharmacy not found",
      });
    }

    const cacheKey = `inventory:${pharmacy._id}`;

    
    const cachedInventory = await redisClient.get(cacheKey);

    if (cachedInventory) {
      console.log("✅ Cache HIT");

      return res.status(200).json(JSON.parse(cachedInventory));
    }

    console.log("❌ Cache MISS");

  
    const inventory = await Inventory.find({
      PharmacyId: pharmacy._id,
    }).sort("-createdAt");

    const response = {
      success: true,
      count: inventory.length,
      data: inventory,
    };

    
    await redisClient.setEx(
      cacheKey,
      300,
      JSON.stringify(response)
    );

    res.status(200).json(response);
  } catch (error) {

    console.log("getmyinventory error:",error);
    res.status(500).json({
      message: error.message,
    });
  }
};


export const searchMedicine = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({
        message: "Please provide a medicine name",
      });
    }

    const cacheKey = `medicine:${name.toLowerCase()}`;

  
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      console.log("Cache HIT");
      return res.status(200).json(JSON.parse(cachedData));
    }

    console.log("Cache MISS");

    const results = await Inventory.find({
      medicineName: { $regex: name, $options: "i" },
      isAvailable: true,
      stockQuantity: { $gt: 0 },
    })
      .populate("PharmacyId", "name address phoneNumber location")
      .select("-__v");

    const response = {
      success: true,
      count: results.length,
      data: results,
    };

    
    await redisClient.setEx(cacheKey, 300, JSON.stringify(response));

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      message: "Search failed",
      error: error.message,
    });
  }
};


export const getMedicineById = async (req, res) => {
  console.log("getmedicinebyid called");
  console.log(req.params);
  try {
    const { medicineId } = req.params;

    const medicine = await Inventory.findById(medicineId);

    if (!medicine) {
      return res.status(404).json({
        message: "Medicine not found",
      });
    }

    res.status(200).json({
      success: true,
      data: medicine,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};