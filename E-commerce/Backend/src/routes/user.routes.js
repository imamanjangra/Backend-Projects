import {registerUser , loginUser , logoutUser , changeCurrentPassword , getuserData , updateUserInfo  , refreshAccessToken} from "../controllers/user.controllers.js"
// import Protect from "../middleware/auth.middleware.js"
import { Router } from "express";
import {Protect} from "../middleware/auth.middleware.js"
const router = Router()

router.route("/register").post(registerUser)

router.route("/login").post(loginUser)
router.route("/logout").post(Protect , logoutUser)
router.route("/changePassword").post(Protect , changeCurrentPassword)
router.route("/update").patch(Protect , updateUserInfo)
router.route("/userdata").get(Protect , getuserData)
router.route("/refreshTokens").get(Protect , refreshAccessToken)


export default router