import mongoose from "mongoose"

const OrderSchema = new mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,

    },

    pharmacy:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pharmacy", 
     required: true 
    },

    items:[{
        inventoryItem:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Inventory",
        required:true
    },  
        medicineName:String,
        quantity: { type: Number, required: true },
        pricePerUnit: { type: Number, required: true }

    }],

    totalAmount :{
        type:String,
        required:true,
    },

    status: { 
        type: String, 
        enum: ["Pending", "Confirmed", "Picked Up", "Cancelled"], 
        default: "Pending" 
    },
    reservationCode: { type: String, unique: true }

}, { timestamps: true });

const Order = mongoose.model("Order",OrderSchema);
export default Order;
