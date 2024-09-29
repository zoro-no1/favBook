import { Router } from "express";
import {
  logInUser,
  registerUser,
  logout,
  refreshAccessToken,
  passwordChange,
  currentUser,
  changeNameAndEmail,
  getUserPageProfile,
} from "../controller/user.js";
import { isLogin } from "../middlewares/IsLogin.middleWare.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/Login").post(logInUser);
router.route("/logout").post(isLogin, logout);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(isLogin, passwordChange);
router.route("/current-user").post(isLogin, currentUser);
router.route("/change-detail").patch(isLogin, changeNameAndEmail);
router.route("/getUserPage/:username").get(isLogin,getUserPageProfile)

export default router;
