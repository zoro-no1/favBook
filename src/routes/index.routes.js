import { Router } from "express";
import { isLogin } from "../middlewares/IsLogin.middleWare.js";
import { likes, post } from "../controller/like.controller.js";

const router=Router();

router.route("/like/:bookName").get(isLogin,likes);
router.route("/post").post(isLogin,post)

export default router
