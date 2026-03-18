import { Router } from "express";
import { Protect } from "../middleware/auth.middleware.js";
import { adminVerify } from "../middleware/admin.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();


export default router;