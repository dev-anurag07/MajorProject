import express from "express"
import { CreateOrder } from "../controller/order.controller.js";
import { protect ,authorize} from "../middleware/authmiddleware.js";
import { getOrders } from "../controller/order.controller.js";
import { getPharmacyOrders } from "../controller/order.controller.js";
import { updateOrderStatus } from "../controller/order.controller.js";
import { cancelOrder } from "../controller/order.controller.js";
import { searchOrderByCode } from "../controller/order.controller.js";


const router = express.Router();
//user
router.post("/reserve",protect,CreateOrder);
router.get("/my-orders",protect,getOrders);
router.put("/cancel/:id", protect, cancelOrder);
//pharmacy
router.get("/incoming",protect,authorize("pharmacy"),getPharmacyOrders);
router.put("/status/:orderId",protect,authorize("pharmacy"),updateOrderStatus);
router.get("/search/:code",protect,authorize("pharmacy"),searchOrderByCode);

export default router;