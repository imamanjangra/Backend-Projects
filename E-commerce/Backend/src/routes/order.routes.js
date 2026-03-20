import { Router } from "express";
import { Protect } from "../middleware/auth.middleware.js";
import {shoppingCart} from "../controllers/shoppingCart.controller.js"
const router = Router();

router.route("/shoppingCart/:id").post(Protect , shoppingCart)



export default router;