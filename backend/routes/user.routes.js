import express from "express";
import { loginUser,registerUser,addAddress,addAvatar } from "../controller/user.controller.js";
import upload from "../middleware/multer.middleware.js";
import { authorize, protect } from "../middleware/authmiddleware.js";
import { getNearbyPharmacies } from "../controller/pharmacy.controller.js";
import { getPharmacydetails } from "../controller/pharmacy.controller.js";
import { getAddresses } from "../controller/user.controller.js";
import { getUserProfile,updateUserProfile } from "../controller/user.controller.js";


const router = express.Router();

router.post('/register',registerUser);
router.post('/login',loginUser);

router.put('/add-avatar',protect,upload.single("avatar"),addAvatar);


router.post('/add-address',protect,addAddress);
router.get("/nearby",protect,getNearbyPharmacies)
router.get("/getpharmacydetails/:id",protect,getPharmacydetails)
router.get("/get-address",protect,getAddresses);
router.get("/profile",protect,getUserProfile);
router.put("/profile",protect,upload.single("image"),updateUserProfile);

export default router;