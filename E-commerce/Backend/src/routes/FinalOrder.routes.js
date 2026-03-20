import { Router } from "express";
import { Protect } from "../middleware/auth.middleware.js";
import { createFinalOrder } from "../controllers/FinalOrder.controller.js";
// import {shoppingCart} from "../controllers/shoppingCart.controller.js"
const router = Router();

router.route("/finalorder").post(Protect , createFinalOrder)



export default router;