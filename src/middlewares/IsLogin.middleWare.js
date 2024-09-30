import { User } from "../models/user.model.js";
import apiError from "../utils/apiError.js";
import { asynchandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

export const isLogin = asynchandler(async (req,res,next)=>{

   try {
     const token =req.cookies.accessToken
     const userToken =jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
     if (!userToken) {
         new apiError(500,"token not found")
     }
      
     const user=await User.findOne(token._id).select("-password -refreshToken")
     
     if (!user) {
         new apiError(401,"user not found");
     }
     req.user=user;
     next()
 
   } catch(err) {
        new apiError(401,err?.message||"isLogin error")
   }

})