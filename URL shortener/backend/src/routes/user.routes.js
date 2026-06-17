import { Protect } from "../middleware/auth.middleware.js";

import {
  CreateUser,
  loginUser,
  LogoutUser,
  changeCurrentPassword,
  getuserData,
  updateUserInfo,
  refreshAccessToken,
} from "../controllers/user.controller.js";

import { Router } from "express";

const router = Router();

router.route("/register").post(CreateUser);
router.route("/login").post(loginUser);
router.route("/logout").post(Protect, LogoutUser);
router.route("/changepassword").post(Protect, changeCurrentPassword);
router.route("/update").patch(Protect, updateUserInfo);
router.route("/userdata").get(Protect, getuserData);
router.route("/refreshToken").get(Protect, refreshAccessToken);


export default router;
