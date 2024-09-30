import { Router } from "express";
import { isLogin } from "../middlewares/IsLogin.middleWare.js";
import { createLike, likes, post } from "../controller/like.controller.js";

const router=Router();

router.route("/show/:bookName").get(isLogin,likes);
router.route("/post").post(isLogin,post);
router.route("/createLike/:bookname").get(isLogin,createLike)

export default router
