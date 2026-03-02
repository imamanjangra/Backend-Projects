import {createShortUrl , redirectUrl , getMyUrl , deleteUrl , updateUrl} from "../controllers/url.controller.js"
import { ValidateUrl } from "../middleware/urlValidater.middleware.js";
import { Protect } from "../middleware/auth.middleware.js";
import { Router } from "express";

const router = Router();

router.route("/create").post(ValidateUrl , Protect , createShortUrl)
router.route("/getUrl").get(Protect , getMyUrl)
router.route("/delete/:id").delete(Protect , deleteUrl)
router.route("/update/:id").patch(Protect , updateUrl)
router.route("/:shortID").get(redirectUrl)
export default router;