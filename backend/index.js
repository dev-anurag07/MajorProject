import express from "express"
import connectDB from "./config/db.js";
import dotenv from "dotenv"
import userRoutes from "./routes/user.routes.js"
import Pharamcyroutes from "./routes/pharmacy.route.js"
import Inventoryroutes from "./routes/inventory.routes.js"
import Orderroutes from "./routes/order.routes.js"
import startexpirationjob from "./utils/expireorder.js";
import cors from "cors"
import "./config/redis.js"

dotenv.config();

const app =express();

app.use(cors({
  origin: ["http://localhost:5173","https://major-project-sooty-eight.vercel.app"] ,// frontend
  credentials: true
}));

connectDB();


app.use(express.json());
app.use(express.urlencoded({extended:true}));

startexpirationjob();

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.use('/api/user',userRoutes);
app.use("/api/pharmacy", Pharamcyroutes);
app.use("/api/inventory",Inventoryroutes);
app.use("/api/orders",Orderroutes);


console.log("new server started");
const PORT =process.env.PORT||8000;
app.listen(PORT,()=>{
    console.log(`server is listneing on ${PORT}`)
})

