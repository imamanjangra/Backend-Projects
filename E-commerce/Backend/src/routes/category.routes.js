import { Router } from "express";
import {createCategory , getAllCategories} from "../controllers/category.controllers.js"
import { Protect } from "../middleware/auth.middleware.js";
import { adminVerify } from "../middleware/admin.middleware.js";

const router = Router();


router.route("/create").post(
  Protect,
  adminVerify,
  createCategory
)

router.route("/getAllCategory").get(
  Protect,
  adminVerify,
  getAllCategories
)

export default router;