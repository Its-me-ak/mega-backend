import { User } from "../models/user.models";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from 'jsonwebtoken'

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Autorization")?.replace("Bearer ", "")
 
    if(!token) {
     throw new ApiError(401, "Unauthorized token")
    }
 
   const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    await User.findById(decodedToken?._id)
    .select("-password", "-refreshToken")
 
    if(!User){
       // TODO dicuss frontend
       throw new ApiError(401, "Invalid Access Token")
    }
 
    req.user = user
    next()
  } catch (error) {
    throw new ApiError(401, error?.message, "Invalid Access Token")
  }
})