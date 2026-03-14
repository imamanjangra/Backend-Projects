import {createAddress , updateAddress , deleteAddress , getAddress} from "../controllers/address.controllers.js"
import { Router } from "express";
import {Protect} from "../middleware/auth.middleware.js"

const router = Router()

router.route("/addAddress").post(Protect , createAddress)
router.route("/updateAddress/:id").patch(Protect , updateAddress)
router.route("/deleteAddress/:id").delete(Protect , deleteAddress)
router.route("/getAddress").get(Protect , getAddress)

export default router

