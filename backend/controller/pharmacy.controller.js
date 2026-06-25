import Inventory from "../models/inventory.model.js";
import Pharmacy from "../models/pharmacy.model.js";

export const addPharmacy = async (req,res)=>{// this req has req.body and req.user and req.params and req.query
try {
    const {name, phoneNumber, address, longitude,latitude,licenseNumber}= req.body;

    if(!name || !longitude || !latitude || !licenseNumber){
        return res.status(400).json({message:"Please provide all required fields including location"});
    }


    const newPharmacy = new Pharmacy({
        name,
        owner:req.user.id,
        phoneNumber,
        address,
        location:{
            type:"Point",
            coordinates:[parseFloat(longitude),parseFloat(latitude)]
        },
        licenseNumber

    });

    await newPharmacy.save();

    res.status(201).json({
        success:true,
        message:"Pharmacy registered successfully",
        pharmacy: newPharmacy
    });

} catch (error) {
    if(error.code === 11000){
    return res.status(400).json({message:"license number already exists"});
}


res.status(500).json({message:"Server error", error:error.message});
}
}


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
    inventoryId: "$inventory_items._id"
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