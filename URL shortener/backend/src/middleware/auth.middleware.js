import { User } from "../model/user.model.js";
import jwt from "jsonwebtoken"
export const Protect = async(req , res , next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer " , "");

        if(!token){
            return res.status(401).json({message : "Unauthorized request"})
        }

        const decodedToken = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken._id).select("-password -refreshToken");

        if(!user){
            return res.status(404).json({Message : "User not found or anauthorized request "});
        }

        req.user = user;

        next()

    } catch (error) {
        return res.status(400).json({message : "Invalid access token" , error})
    }
}