import express from "express"
import connectDB from "./config/db.js";
import dotenv from "dotenv"
import userRoutes from "./routes/user.routes.js"
import Pharamcyroutes from "./routes/pharmacy.route.js"
import Inventoryroutes from "./routes/inventory.routes.js"
import Orderroutes from "./routes/order.routes.js"
import startexpirationjob from "./utils/expireorder.js";
import cors from "cors"

dotenv.config();

const app =express();

app.use(cors({
  origin: "http://localhost:5173", // frontend
  credentials: true
}));

connectDB();

//middleware to parse json and form data
app.use(express.json());
app.use(express.urlencoded({extended:true}));

startexpirationjob();

app.use('/api/user',userRoutes);
app.use("/api/pharmacy", Pharamcyroutes);
app.use("/api/inventory",Inventoryroutes);
app.use("/api/orders",Orderroutes);



const PORT =process.env.PORT||8000;
app.listen(PORT,()=>{
    console.log(`server is listneing on ${PORT}`)
})

