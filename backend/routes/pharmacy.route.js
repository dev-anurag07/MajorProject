import express from "express";
import { addPharmacy,getPharmacyProfile, updatePharmacyProfile } from "../controller/pharmacy.controller.js";
import {protect,authorize} from "../middleware/authmiddleware.js";

const router = express.Router();


router.post("/register",protect,authorize("pharmacy"),addPharmacy);
router.get("/profile",protect,authorize("pharmacy"),getPharmacyProfile);
router.put("/profile",protect,authorize("pharmacy"),updatePharmacyProfile);

export default router;