import { asynchandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import apiError from "../utils/apiError.js";
import ApiSuccess from "../utils/ApiRes.js"

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
    // data from body
    //verifycation
    //add cookie

    const {username,email,password}=req.body;

    if (!username && !email){
        new apiError(400,"username required")
    }

        const user = await User.findOne({
            $or:[{username},{email}]
        })

        if (!user) {
            new apiError(409,"user not found")
        }
       
        const PasswordCorrect = await user.isPasswordCorrect(password);

        if (!PasswordCorrect){ new apiError(409,"password is incorrect")}

        const {accessToken , refreshToken }= await generateAccessAndRefreshToken(user._id);

        const options = {

            httpOnly:true,
            secure:true

        }


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

    const options ={
        httpOnly:true,
        secure:true
    }

    res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiSuccess(200,{},"logout successfully")
    )

})
export {
    registerUser,
    logInUser,
    logout
}

