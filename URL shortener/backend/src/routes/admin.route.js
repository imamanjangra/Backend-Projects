import {getDashboardStats , TotalUser , TotalURL , updateUserInfo , updateUrl} from "../controllers/admin.controller.js"
import { adminVerify } from "../middleware/adminVerify.middleware.js"
import { Protect } from "../middleware/auth.middleware.js"
import { Router } from "express"

const router = Router()

router.route("/stats").get(Protect , adminVerify ,getDashboardStats)
router.route("/TotalUser").get(Protect, adminVerify ,  TotalUser);
router.route("/TotalUrl").get(Protect, adminVerify ,  TotalURL);
router.route("/updateUser/:id").post(Protect, adminVerify ,  updateUserInfo);
router.route("/updateUrl/:id").post(Protect, adminVerify ,  updateUrl);

export default router