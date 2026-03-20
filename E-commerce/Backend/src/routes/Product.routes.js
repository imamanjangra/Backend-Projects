import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getAllProductUser
} from "../controllers/Product.controlles.js";
import { Router } from "express";
import { Protect } from "../middleware/auth.middleware.js";
import { adminVerify } from "../middleware/admin.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.route("/create").post(
  Protect,
  adminVerify,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  createProduct,
);

router.route("/deleteProduct").delete(Protect , adminVerify , deleteProduct)

router.route("/update/:id").patch(Protect, adminVerify ,  updateProduct);

router.route("/getProductsByCategory/:categoryId").get(Protect, adminVerify ,  getProductsByCategory);

router.route("/getAllProductUser").get(Protect, adminVerify ,  getAllProductUser);

export default router;
