import express from "express"
import { deleteMedicine, getMyInventory, UpdateMedicine,searchMedicine } from "../controller/inventory.controller.js";
import { addMedicine } from "../controller/inventory.controller.js";
import { authorize,protect } from "../middleware/authmiddleware.js";

const router = express.Router()

router.put("/update/:medicineId",protect,authorize("pharmacy"),UpdateMedicine)
router.post("/add",protect,authorize("pharmacy"),addMedicine)
router.get("/my", protect, authorize("pharmacy"), getMyInventory);
router.delete("delete/:medicineId", protect,authorize("pharmacy"),deleteMedicine)
router.get("/search", searchMedicine);

export default router;