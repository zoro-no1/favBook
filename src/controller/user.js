import { asynchandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import apiError from "../utils/apiError.js";
import ApiSuccess from "../utils/ApiRes.js"
import jwt from"jsonwebtoken"


const options ={
    httpOnly:true,
    secure:true
}
const generateAccessAndRefreshToken= async(userId)=>{

        const user= await User.findById(userId);
        const accessToken = user.generateAccessToken()
        const refreshToken =  user.generateRefreshToken()
    
        user.refreshToken=refreshToken
        await user.save({validateBeforeSave:false})
    
        return {accessToken,refreshToken}
    
  }

const registerUser = asynchandler(async (req,res)=>{
   // get info from frontend 
    //validation
    //check user already exists 
    //create user 
    //check user created 


    const {username,email,password}=req.body

    if ([username,email,password].some((field)=>field?.trim()==="")) {
        throw new apiError(401,"all field required")
    }

    const existsUser=await User.findOne({
        $or:[{username},{email}]
    })
    if (existsUser) {
       throw new apiError(409,"User already exists")   
    }

  const createdUser= await User.create({
      username,
      email,
      password,
       
    })
        
        
    const user = await User.findById(createdUser._id)

    if (!user) throw new apiError(500,"server prodlem whill creating the user ")
        
    res.status(200).json(
        new ApiSuccess(200,user,"successfully user created ")
    )

})

const logInUser = asynchandler(async (req,res)=>{
 

    const {username,email,password}=req.body;

    if (!username && !email){
       throw new apiError(400,"username required")
    }

        const user = await User.findOne({
            $or:[{username},{email}]
        })
    
        
        if(!user) {
           throw new apiError(409,"user not found")
            console.log("problem");
            
        }
       
        const PasswordCorrect = await user.isPasswordCorrect(password);
      
        

        if(!PasswordCorrect){throw new apiError(409,"password is incorrect")}

        const {accessToken , refreshToken }= await generateAccessAndRefreshToken(user._id);

     


        res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options)
        .json(
            new ApiSuccess(200,{
                user:accessToken,refreshToken
            })
        )
            
       

})

const logout=asynchandler(async(req,res)=>{
      
    await User.findByIdAndUpdate(req.user._id,{
        $unset:{
            refreshToken:1
        }
    },{new :true})

    res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiSuccess(200,{},"logout successfully")
    )

})

const refreshAccessToken=asynchandler(async (req,res)=>{

   const refreshCookietoken= req.cookies.refreshToken;
try {
    
       if (!refreshAccessToken) {
          throw  new apiError(401,"Refresh Cookie Not Found")
       };
    
      const decodedToken= jwt.verify(refreshCookietoken,process.env.REFRESH_TOKEN_SECRET)
    
      const user = await User.findById(decodedToken._id)
      
      if (!user) {
        throw new apiError(500,"cookie not valid ")
      }
    
      const {accessToken,refreshToken}= await generateAccessAndRefreshToken(user._id)
    
      res.status(200)
      .cookie("accessToken",accessToken,options)
      .cookie("refreshToken",refreshToken,options)
      .json(
        new ApiSuccess(200,{accessToken,refreshToken},"access token refresh")
      )
    
} catch (error) {
    throw new apiError(500,"not refresh access token ")
}

})

const passwordChange=asynchandler(async (req,res)=>{

    const {oldPassword,newPassword}=req.body;

    if(!oldPassword||!newPassword){
        throw new apiError(401,"enter valid Password")
    }
    const user = await User.findByIdAndUpdate(req.user._id);
    const PasswordCorrect= await user.isPasswordCorrect(oldPassword);
    
    if (!PasswordCorrect) {
        throw new apiError(401,"old Password incorrect")
    }
   user.password =newPassword;
   await user.save({validateBeforeSave:false})

   res.status(200).json(
    new ApiSuccess(200,{},"password change successfully ")
   )

})

const currentUser=asynchandler(async (req,res)=>{

    return res.status(200).json(
        new ApiSuccess(200,{
            user:req.user
        },"get user successfully")
    )
})

const changeNameAndEmail=asynchandler(async(req,res)=>{

    const {username,email}=req.body;
    if(!(username||email)){throw new apiError(400,"enter username or email")}

    const user =await User.findByIdAndUpdate(req.user._id,{
        $set:{
            username,
            email
        }
    },{new:true})

    res.status(200).json(new ApiSuccess(200,{user},"detail update"))

})

const getUserPageProfile=asynchandler(async (req,res)=>{

    const {username}=req.params
  
    

    if (!username?.trim()) {
        throw new apiError(401,"user page not found")
    }

   const page= await User.aggregate([{
        $match:{ username}
    },
    {
        $lookup:{
            from:"followers",
            localField:"_id",
            foreignField:"followers",
            as:"followersCount"
        }
    },
    {
        $lookup:{

            from:"followers",
            localField:"_id",
            foreignField:"following",
            as:"followingCount"
        }
    },
    {
        $addFields:{
            totalFollower:{
                $size:"$followersCount"
            },
            totalFollowing:{
                $size:"$followingCount"
            },
          /*  isFollow:{
                $cond:{
                    if:{$in:[req.user?._id,"followersCount.followers"]},
                    then:true,
                    else:false
                }
            }*/
        }
    },
    {
        $project:{
            username:1,
            email:1,
            totalFollower:1,
            totalFollowing:1,
            isFollow:1
        }
    }
])


console.log(page);


res.status(200).json(
    new ApiSuccess(200,{page:page[0]},"successful")
)

})
export {
    registerUser,
    logInUser,
    logout,
    refreshAccessToken,
    passwordChange,
    currentUser,
    changeNameAndEmail,
    getUserPageProfile
}

