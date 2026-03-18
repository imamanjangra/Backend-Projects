import {getProducts} from '../controllers/pagination.controller.js'
import { Router } from "express";
const router = Router();


router.route('/getProducts').get(getProducts);


export default router; 

