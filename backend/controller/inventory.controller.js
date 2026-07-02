import Inventory from "../models/inventory.model.js";
import Pharmacy from "../models/pharmacy.model.js";

export const addMedicine = async (req, res) => {
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

    // 🔥 get pharmacy from logged-in user
    const pharmacy = await Pharmacy.findOne({ owner: req.user.id });

    if (!pharmacy) {
      return res.status(404).json({
        message: "Pharmacy not found for this user"
      });
    }

   
    const newInventory = await Inventory.create({
      PharmacyId: pharmacy._id, 
      medicineName,
      manufacturer,
      price,
      stockQuantity,
      category,
      expiryDate,
      isAvailable:
        isAvailable !== undefined ? isAvailable : stockQuantity > 0,
    });

    res.status(201).json({
      success: true,
      message: "Medicine added successfully",
      data: newInventory,
    });

  } catch (error) {
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
        isAvailable:isAvailable!==undefined?isAvailable:(stockQuantity!==undefined)?stockQuantity>0:medicine.isAvailable,
      },{new:true,runValidators:true})

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
            res.status(200).json({ success: true, message: "Medicine removed from inventory" })
        }

     catch (error) {
        res.status(500).json({message:error.message})
    }
}


export const getMyInventory = async (req, res) => {
  try {
    // 🔥 find pharmacy of logged-in user
    const pharmacy = await Pharmacy.findOne({ owner: req.user.id });

    if (!pharmacy) {
      return res.status(404).json({
        message: "Pharmacy not found"
      });
    }

    // 🔥 get inventory
    const inventory = await Inventory.find({
      PharmacyId: pharmacy._id
    }).sort("-createdAt");

    res.status(200).json({
      success: true,
      count: inventory.length,
      data: inventory,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


export const searchMedicine = async(req,res)=>{
    try {
        const { name } = req.query;

        if (!name) {
            return res.status(400).json({ message: "Please provide a medicine name" });
        }

        const results = await Inventory.find({
             medicineName:{$regex : name, $options:"i"},
             isAvailable:true,
            stockQuantity:{$gt:0}
        }).populate("PharmacyId","name address phoneNumber location")
        .select("-__v")


        res.status(201).json({
            success:true,
            count:results.length,
            data:results,
        })

    } catch (error) {
        res.status(500).json({ message: "Search failed", error: error.message });
    }
}