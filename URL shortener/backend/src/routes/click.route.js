import {Urlstats} from "../controllers/click.controller.js"
import { Router } from "express";

const router = Router();

router.route("/stats/:id").get(Urlstats)

export default router