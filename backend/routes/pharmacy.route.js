import express from "express";
import { addPharmacy} from "../controller/pharmacy.controller.js";
import {protect,authorize} from "../middleware/authmiddleware.js";
import { getPharmacyProfile } from "../controller/pharmacy.controller.js";
import { updatePharmacyProfile } from "../controller/pharmacy.controller.js";
import upload from "../middleware/multer.middleware.js";

const router = express.Router();


router.post("/register",protect,authorize("pharmacy"),addPharmacy);
router.get("/profile",protect,authorize("pharmacy"),getPharmacyProfile);
router.put("/profile",protect,authorize("pharmacy"),upload.single("image"),updatePharmacyProfile);

export default router;