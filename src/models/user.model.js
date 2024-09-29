import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import brcypt, { hash } from "bcrypt";

const userSchema = new Schema(
  {
    username: {
      type: String,
     required: true,
      lowercase: true,
      unique: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unipue: true,
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken:{
      type:String
    }
   /* like: {
      type: mongoose.Types.ObjectId,
      ref: "post",
    },
    userPost: {
      type: mongoose.Types.ObjectId,
      ref: "post",
    },*/
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
 this.password = await new brcypt.hash(this.password, 10)
  next();
});
userSchema.methods.isPasswordCorrect = async function (password) {
  return await brcypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
 return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  )
};

userSchema.methods.generateRefreshToken = function () {
  return  jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
