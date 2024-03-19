import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Jwt  from "jsonwebtoken";
export const veriftyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookie?.accessToken || req.header("Authorization").replace("Bearer", "")
    
        if (!token) {
            throw new ApiError(401, "Unauthorized acces")
        }
    
    
        const decodedToken = await jwt.verifty(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            //NEXT TODO
            throw new ApiError(401, "Invalid Acces Token")
        }
    
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message ||"Invalid acccess token ")
    }


})