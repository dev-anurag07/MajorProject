import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    Name:{
        type:String,
        required:true,

    },

    avatar:{
       url:String,
       public_id:String,
    },

    email:{
        type:String,
        required:true,
    },

    password:{
        type:String,
        required:true,
    },

    phoneNumber:{
        type:Number,
        required:true
    },
    
    role:{
        type:String,
        enum:['user','pharmacy','admin']
    },

    addresses:[
       {
        label:{
            type:String,
            enum: ["Home", "Work", "Other"],
            default: "Home",
        },
        address:{
            type:String,
            required:true,
        },

        pincode:Number,
        city:String,
        state:String,

        location:{
            type:{
                type:String,
                enum:["Point"],
                default:"Point",
            },
            coordinates:{
             type:[Number],
             required:true,
            }

        }
       }
    ]
        
    
},{timestamps:true});

userSchema.index({"addresses.location":"2dsphere"});

const User = mongoose.model("User",userSchema);
export default User;
