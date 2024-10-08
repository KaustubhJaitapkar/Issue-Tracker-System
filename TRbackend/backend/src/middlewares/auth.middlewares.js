import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const authHeader = req.header("Authorization");
        
        console.log(authHeader);
        if (!authHeader) {
            throw new ApiError(401, "Authorization header is missing");
            console.log("Authorization header is missing");
        }

        if (!authHeader.startsWith("Bearer ")) {
            throw new ApiError(401, "Authorization header format is invalid");
            console.log("Authorization header format is invalid");
            
        }

        const token = authHeader.replace("Bearer ", "");
        if (!token) {
            throw new ApiError(401, "Token is missing");
        }

        console.log("Extracted token: " + token);

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("JWT verification failed:", error.message);
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});
