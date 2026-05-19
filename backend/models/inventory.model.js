import mongoose from "mongoose"
import Pharmacy from "./pharmacy.model.js"

const inventorySchema = new mongoose.Schema({
    PharmacyId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:Pharmacy,
        required:true,
    },

    medicineName:{
        type:String,
        required:true,
        lowercase:true,
    },

    manufacturer:{
        type:String,
        trim:true,
    },

    price: {
        type: Number,
        required: true
    },

    stockQuantity: {
        type: Number,
        required: true,
        default: 0,
        min:0,
    },

    category: {
        type: String,
    },
     
    expiryDate: {
        type: Date
    },

    isAvailable: {
        type: Boolean,
        default: true
    },



},{timestamp:true});

inventorySchema.index({medicineName:"text"});

const Inventory = mongoose.model('Inventory',inventorySchema);
export default Inventory;