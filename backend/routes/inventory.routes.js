import express from "express"
import { deleteMedicine, getMyInventory, UpdateMedicine,searchMedicine, getMedicineById } from "../controller/inventory.controller.js";
import { addMedicine } from "../controller/inventory.controller.js";
import { authorize,protect } from "../middleware/authmiddleware.js";
import upload from "../middleware/multer.middleware.js";

const router = express.Router()

router.put("/update/:medicineId",protect,authorize("pharmacy"),upload.single("image"),UpdateMedicine)
router.post("/add",protect,authorize("pharmacy"),upload.single("image"),addMedicine)
router.get("/my", protect, authorize("pharmacy"), getMyInventory);
router.delete("/delete/:medicineId", protect,authorize("pharmacy"),deleteMedicine)
router.get("/search", searchMedicine);
router.get("/medicine/:medicineId",protect,authorize("pharmacy"),getMedicineById);

export default router;