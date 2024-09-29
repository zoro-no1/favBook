import { asynchandler } from "../utils/asyncHandler.js"
import { Post } from "../models/post.model.js";
import ApiSuccess from "../utils/ApiRes.js";
import apiError from "../utils/apiError.js";




const likes = asynchandler(async (req,res)=>{

const {bookName}=req.params;

if (!bookName) {
    throw new apiError(401,"book name not found ")
}
const a= await Post.find({bookName:bookName})
console.log(a);

const like= await Post.aggregate([{
    $match:{bookName}
},
    {
        $lookup:{
            from:"likes",
            localField:"_id",
            foreignField:"likeBy",
            as:"likeByUser"
        }
    },
    {
        $lookup:{
            from:"likes",
            localField:"_id",
            foreignField:"likedPost",
            as:"Post"
        }
    },
    {
        $addFields:{
            likes:{
                $size:"$likeByUser"
            },
            post:"$Post"
        }

    },{
        $project:{
            bookName:1,
            dis:1,
            owner:1,
            likes:1,
            Post:1
        }
    }

])
console.log(like);

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
  
})

export {
    likes,
    post,
    createLike
}