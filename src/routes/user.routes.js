import { Router } from "express";
import { logInUser, registerUser ,logout} from "../controller/user.js";
import { isLogin } from "../middlewares/IsLogin.middleWare.js";

const router = Router()

router.route("/register").post(registerUser)
router.route("/Login").post(logInUser)
router.route("/logout").post(isLogin,logout)

export default router