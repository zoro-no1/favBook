import mongoose,{Schema} from "mongoose";

const likeSchema = new Schema({
    likeBy:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    likedPost:{
        type:Schema.Types.ObjectId,
        ref:"Post"
    }
})

export const Like = mongoose.model("Like",likeSchema)