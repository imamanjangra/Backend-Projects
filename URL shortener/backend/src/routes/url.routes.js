import {createShortUrl  , getMyUrl , deleteUrl , updateUrl , Urlinfo , serchUrl} from "../controllers/url.controller.js"
import { ValidateUrl } from "../middleware/urlValidater.middleware.js";
import { Protect } from "../middleware/auth.middleware.js";
import { Router } from "express";

const router = Router();

router.route("/create").post(ValidateUrl , Protect , createShortUrl)
router.route("/getUrl").get(Protect , getMyUrl)
router.route("/delete/:id").delete(Protect , deleteUrl)
router.route("/update/:id").patch(Protect , updateUrl)
router.route("/urlinfo/:id").get(Protect , Urlinfo)
router.route("/Search").get(Protect , serchUrl)
export default router;