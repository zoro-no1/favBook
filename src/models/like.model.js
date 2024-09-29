import mongoose,{Schema} from "mongoose";

const likeSchema = new Schema({
    likeBy:{
        type:mongoose.Types.ObjectId,
        ref:user
    },
    likedPost:{
        type:mongoose.Types.ObjectId,
        ref:post
    }
})

export const like = mongoose.model("like",likeSchema)