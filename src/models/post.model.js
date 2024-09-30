import mongoose, { Schema } from "mongoose";



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
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    // like:{
    //   type:mongoose.Types.ObjectId,
    //   ref:"User"
    // }
   


  },
  {
    timestamps: true,
  }
);
export const Post=mongoose.model("Post",postSchema)
