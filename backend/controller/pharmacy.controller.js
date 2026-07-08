import Inventory from "../models/inventory.model.js";
import Pharmacy from "../models/pharmacy.model.js";
import upload from "../middleware/multer.middleware.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

export const addPharmacy = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const {
      name,
      phoneNumber,
      address,
      latitude,
      longitude,
      licenseNumber,
    } = req.body;

    if (!name || !latitude || !longitude || !licenseNumber) {
      return res.status(400).json({
        message: "Please provide all required fields.",
      });
    }

    const pharmacy = new Pharmacy({
      owner: req.user.id,
      name,
      phoneNumber,
      address,
      licenseNumber,
      location: {
        type: "Point",
        coordinates: [
          Number(longitude),
          Number(latitude),
        ],
      },
    });

    // Save image if uploaded
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "medicine-finder",
      });

      pharmacy.image = result.secure_url;

      fs.unlinkSync(req.file.path);
    }

    await pharmacy.save();

    return res.status(201).json({
      success: true,
      message: "Pharmacy registered successfully",
      data: pharmacy,
    });

  } catch (error) {
    console.log(error);

    if (error.code === 11000) {
      return res.status(400).json({
        message: "License number already exists",
      });
    }

    return res.status(500).json({
      message: error.message,
    });
  }
};


export const getNearbyPharmacies = async (req,res)=>{
try {
    const {lat,lang,radius,medicine} = req.query;
    console.log(req.query);

    if(!lat || !lang){
        return res.status(400).json({message:"coordinates are required to find nearby pharamcies"});
    }

    const distanceinmeters = radius ? parseFloat(radius)*1000:500000;
console.log(await Pharmacy.find());
    const pharmacies = await Pharmacy.aggregate([
  {
    $geoNear: {
      near: {
        type: "Point",
        coordinates: [parseFloat(lang), parseFloat(lat)]
      },
      distanceField: "distance_km",
      maxDistance: distanceinmeters,
      distanceMultiplier: 0.001,
      spherical: true
    }
  },

  {
    $lookup: {
      from: "inventories",
      localField: "_id",
      foreignField: "PharmacyId",
      as: "inventory_items"
    }
  },

  {
    $unwind: "$inventory_items"
  },

  {
    $match: {
      "inventory_items.medicineName": {
        $regex: new RegExp(medicine, "i")
      },
      "inventory_items.stockQuantity": { $gt: 0 }
    }
  },

 {
  $project: {
    _id: 0,
    pharmacyId: "$_id",
    pharmacyName: "$name", // ✅ IMPORTANT
    distance_km: 1,
    medicineName: "$inventory_items.medicineName", // ✅ IMPORTANT
    price: "$inventory_items.price", // ✅ IMPORTANT
    inventoryId: "$inventory_items._id",
    stockQuantity:"$inventory_items.stockQuantity",
    isAvailable:"$inventory_items.isAvailable",
    image:"$inventory_items.image",

  }
}

]); 

console.log(pharmacies);



// ✅ Now response
res.status(200).json({
  success: true,
  count: pharmacies.length,
  data: pharmacies
});


} catch (error) {
    console.error("Search Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal Server Error during search" 
        });
    }

}





export const getPharmacydetails = async (req,res)=>{
    try {
        const {id} = req.params;
        const pharmacy = await Pharmacy.findById(id);
        const inventory = await Inventory.find({PharmacyId:id, isAvailable:true})

        res.status(200).json({
            success: true,
            data: { pharmacy, inventory }
        });

    } catch (error) {
        res.status(500).json({ message: "Error fetching pharmacy details" });
    }
}


export const getPharmacyProfile = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findOne({ owner: req.user.id });

    if (!pharmacy) {
      return res.status(404).json({
        message: "Pharmacy not found",
      });
    }

    res.status(200).json({
      success: true,
      data: pharmacy,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updatePharmacyProfile = async (req, res) => {
  console.log(req.file);
  try {
    const pharmacy = await Pharmacy.findOne({ owner: req.user.id });
console.log(pharmacy);
    if (!pharmacy) {
      return res.status(404).json({
        message: "Pharmacy not found",
      });
    }

    if (req.body.name) pharmacy.name = req.body.name;
    if (req.body.phoneNumber) pharmacy.phoneNumber = req.body.phoneNumber;
    if (req.body.address) pharmacy.address = req.body.address;

   if (req.file) {
  console.log("Before upload");

  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: "medicine-finder",
  });
  console.log(result);

  console.log("After upload", result.secure_url);

  fs.unlinkSync(req.file.path);

  console.log("After delete");

  pharmacy.image = result.secure_url;
}

    await pharmacy.save();

    res.json({
      success: true,
      message: "Profile Updated",
      data: pharmacy,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};