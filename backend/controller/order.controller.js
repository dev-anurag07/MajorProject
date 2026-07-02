import Inventory from "../models/inventory.model.js";
import Order from "../models/order.model.js";
import Pharmacy from "../models/pharmacy.model.js";

export const CreateOrder = async (req,res)=>{
  try {
      const{items, pharmacyId}=req.body;

    if(!items || items.length === 0){
        return res.status(400).json({message:"Your cart is empty"});
    }
     
    let totalamount =0;
    let processeditems =[];

    for(const item of items){
       const medicine = await Inventory.findById(item.inventoryId);

       if(!medicine){
       return res.status(400).json({message:"Medicine not found"});
       }

       if(medicine.stockQuantity<item.quantity){
        return res.status(400).json({message:`insufficient stock for ${medicine.medicineName}. Available ${medicine.stockQuantity}`});
       }

       totalamount += medicine.price*item.quantity;

       processeditems.push({
                inventoryItem: medicine._id,
                medicineName: medicine.medicineName, // Denormalization for history
                quantity: item.quantity,
                pricePerUnit: medicine.price
       })
    }

    for(const item of items){
        await Inventory.findByIdAndUpdate(item.inventoryId,{
            $inc:{stockQuantity: -item.quantity}
        })
    

    const updatemedicine = await Inventory.findById(item.inventoryId);

    if(updatemedicine.stockQuantity<=0){
       updatemedicine.isAvailable= false;
       await updatemedicine.save();
    }

    }

    const reservationcode = Math.random().toString(36).substring(2,8).toUpperCase();

    const newOrder = await Order.create({
        user:req.user.id,
        pharmacy:pharmacyId,
        items:processeditems,
        totalAmount:totalamount,
        reservationCode:reservationcode,
        status:"Pending",

    })

    res.status(201).json({
            success: true,
            message: "Reservation successful",
            reservationCode: newOrder.reservationCode,
            data: newOrder
        });
  } catch (error) {
        res.status(500).json({ message: "Order failed", error: error.message });
    
  }


}

export const updateOrderStatus = async (req,res)=>{
    try {
        const {orderId}=req.params
        const {status}=req.body
      
        const orderdetails = await Order.findById(orderId);
        if(!orderdetails){
            return res.status(404).json({message:"Order Not Found"});
        }

        if(orderdetails.status==="Cancelled"){
            return res.status(400).json({ 
                success: false, 
                message: "This order is already cancelled/expired and cannot be modified."})
        }

         if (orderdetails.status === "Picked Up") {
      return res.status(400).json({
        message: "Order already completed"
      });
    }

     const validStatuses = ["Confirmed", "Picked Up", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status"
      });
    }

if(status==='Cancelled' && orderdetails.status!=='Cancelled'){
    for(const item of orderdetails.items){
        await Inventory.findByIdAndUpdate(item.inventoryId,{
            $inc:{stockQuantity:item.quantity},
            $set:{isAvailable:true}
        });

    }
}


const updateorder = await Order.findByIdAndUpdate(orderId,{
    status,

},{new:true, runValidators:true});


res.status(200).json({
            success: true,
            message: `Order status updated to ${status}`,
            data: updateorder
        });


    } catch (error) {
        
        res.status(500).json({ message: "Update failed", error: error.message });
    }
}

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "Pending") {
      return res.status(400).json({ message: "Cannot cancel this order" });
    }

    // 🔥 RESTORE STOCK
    for (const item of order.items) {
      await Inventory.findByIdAndUpdate(item.inventoryItem, {
        $inc: { stockQuantity: item.quantity }
      });

      // OPTIONAL: make available again
      const updated = await Inventory.findById(item.inventoryItem);
      if (updated.stockQuantity > 0) {
        updated.isAvailable = true;
        await updated.save();
      }
    }

    // ✅ Update order status
    order.status = "Cancelled";
    await order.save();

    res.json({
      success: true,
      message: "Order cancelled and stock restored",
    });

  } catch (error) {
    res.status(500).json({ message: "Error cancelling order" });
  }
};





export const getOrders = async(req,res)=>{
try {
    const orders = await Order.find({user:req.user.id})
.populate("pharmacy", "name address phoneNumber")
.sort("-createdAt")

res.status(200).json({
    success:true,
    data:orders,
   
})
} catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
}


}

export const getPharmacyOrders = async (req, res) => {
  try {
    const myPharmacies = await Pharmacy.find({
      owner: req.user.id
    }).select("_id");

    if (!myPharmacies || myPharmacies.length === 0) {
      return res.status(404).json({
        message: "No pharmacies found for this user."
      });
    }

    const pharmacyIds = myPharmacies.map(p => p._id);

    const orders = await Order.find({
      pharmacy: { $in: pharmacyIds }
    })
      .populate("pharmacy", "name address")
      .populate("user", "Name phoneNumber")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching dashboard",
      error: error.message
    });
  }
};

export const searchOrderByCode=async(req,res)=>{
  try {
    
const {code}=req.params;

const order = await Order.findOne({reservationCode:code.toUpperCase(),}).populate("user","Name phoneNumber").populate("pharmacy","name address phoneNumber");
if(!order){
  return res.status(404).json({message:"Reservation not found"});
}

res.json({success:true, 
  data :order
});



  } catch (error) {
    res.status(500).json({message:"Server Error"})
  }
}