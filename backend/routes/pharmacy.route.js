import express from "express";
import { addPharmacy } from "../controller/pharmacy.controller.js";
import {protect,authorize} from "../middleware/authmiddleware.js";

const router = express.Router();


router.post("/register",protect,authorize("pharmacy"),addPharmacy);

export default router;