import { asynchandler } from "../utils/asyncHandler.js"
import { Post } from "../models/post.model.js";
import ApiSuccess from "../utils/ApiRes.js";
import apiError from "../utils/apiError.js";
import { Like } from "../models/like.model.js";
import { json } from "express";




const likes = asynchandler(async (req,res)=>{

const {bookName}=req.params;

if (!bookName) {
    throw new apiError(401,"book name not found ")
}
const a= await Post.find({bookName})
console.log(a);

const like= await Post.aggregate([{
    $match:{bookName}
},
    {
        $lookup:{
            from:"likes",
            localField:"_id",
            foreignField:"likedPost",
            as:"likeByUser"
        }
    },
   
    {
        $addFields:{
            likes:{
                $size:"$likeByUser"
            }
          
        }

    },{
        $project:{
            bookName:1,
            dis:1,
            owner:1,
            likes:1,
            
        }
    }

])
console.log(like[0]);

res.status(200).json(new ApiSuccess(200,{like:like[0]},"likes"))
})

const post = asynchandler(async (req,res)=>{
    const {bookName,dis}=req.body

    if (!(bookName||dis)) {
        throw new apiError(400,"need to enter book name ")
    }
   const post = await Post.create({
        bookName,
        dis,
        owner:req.user._id
    })

    res.status(200).json(
        new ApiSuccess(200,{post},"post creat successfully")
    )
})

const createLike=asynchandler(async (req,res)=>{
  const {bookname}=req.params;
  
  if (!bookname) {
    throw new apiError(500,"not found")
  }


  const book=await Post.findOne({bookName:bookname})


  if (!book) {
    throw new apiError(500,"book not found")
  }

    const user=req.user;
  
    const userLiked=await Like.findOne({
        $and:[{likedPost:book._id},{likeBy:user._id}]
    })
  console.log(userLiked);
  
    if (userLiked) {
       const deleteLike= await Like.findOneAndDelete({likeBy:user._id})
        res.status(200).json( new ApiSuccess(200,{deleteLike},"like delete") )
    }else{
      const like =await Like.create({
           likeBy:user._id,
           likedPost:book._id
       })


      const liked= await Like.findById(like._id)
       if (!liked) {
        throw new apiError(500,"like not created ")
       }
    

    res.status(200).json(
        new ApiSuccess(200,{liked},"liked successful")
    )
}
})

export {
    likes,
    post,
    createLike
}