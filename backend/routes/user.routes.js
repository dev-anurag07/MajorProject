import express from "express";
import { loginUser,registerUser,addAddress,addAvatar } from "../controller/user.controller.js";
import { upload } from "../utils/multer.utils.js";
import { protect } from "../middleware/authmiddleware.js";
import { getNearbyPharmacies } from "../controller/pharmacy.controller.js";
import { getPharmacydetails } from "../controller/pharmacy.controller.js";
import { getAddresses } from "../controller/user.controller.js";


const router = express.Router();

router.post('/register',registerUser);
router.post('/login',loginUser);

router.put('/add-avatar',protect,upload.single("avatar"),addAvatar);


router.post('/add-address',protect,addAddress);
router.get("/nearby",protect,getNearbyPharmacies)
router.get("/getpharmacydetails/:id",protect,getPharmacydetails)
router.get("/get-address",protect,getAddresses);

export default router;