import mongoose, { Schema, schema } from "mongoose";



const postSchema = new Schema(
  {

    bookName:{

        type:String,
        required:true,
        index:true,


    },
    dis:{
        type:String,
        required:true,
    },
    img:{
        type:String,
    },
    owner:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    like:[{
        like:mongoose.Types.ObjectId,
        ref:"User"
    }]


  },
  {
    timestamps: true,
  }
);
export const Post=mongoose.model("Post",postSchema)
