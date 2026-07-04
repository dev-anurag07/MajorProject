import mongoose from "mongoose"

const pharmacySchema = new mongoose.Schema({
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true,
    },

     name:{
        type:String,
        required:true,
     },
      
     isOpen:{
      type:Boolean,
      default:true,

     },

     licenseNumber:{
      type:String,
      required:true,
      unique:true,
     },
      

     rating:{
      type:Number,
      default:0,
     },


     address:{
        type:String,
     },

     phoneNumber:{
        type:String,
        required:true,
     },

     image:{
      type:String,
      default:"",
     },

     location:{
       type:{
        type:String,
        enum:['Point'],
        default:'Point',

       },
       coordinates:{
         type:[Number],
         required:true,
     }
   }

},{timestamps:true})

pharmacySchema.index({location:"2dsphere"});

const Pharmacy = mongoose.model("Pharmacy",pharmacySchema);

export default Pharmacy;