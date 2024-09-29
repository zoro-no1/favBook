
import mongoose, {Schema, Types} from "mongoose";

const followerSchema=new Schema({

    followers:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    following:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }

},{timestamps:true})

export const follower = mongoose.model("follower",followerSchema)