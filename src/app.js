import express from "express";
import cookieParser from "cookie-parser";

const app=express();

app.use(express.json({limit:"30kb"}))
app.use(express.urlencoded({extended:true,limit:"30kb"}));
app.use(express.static("public"));
app.use(cookieParser());


//import routers
import user from "./routes/user.routes.js"
import likes from "./routes/like.routes.js";




//router

app.use("/api/v1/user",user);

app.use("/like",likes)


export { app}