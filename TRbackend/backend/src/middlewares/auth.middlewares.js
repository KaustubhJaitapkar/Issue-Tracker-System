import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import ApiError from '../utils/ApiError'; // Assuming ApiError is your custom error class
import User from '../models/User'; // Assuming this is your User model

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");

        if (!authHeader) {
            console.log("Authorization header is missing");
            throw new ApiError(401, "Authorization header is missing");
        }

        if (!authHeader.startsWith("Bearer ")) {
            console.log("Authorization header format is invalid");
            throw new ApiError(401, "Authorization header format is invalid");
        }

        const token = authHeader.replace("Bearer ", "");

        console.log("Extracted token: " + token);

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            console.log("Invalid Access Token: User not found");
            throw new ApiError(401, "Invalid Access Token");
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("JWT verification failed:", error.message);
        throw new ApiError(401, error.message || "Invalid access token");
    }
});
