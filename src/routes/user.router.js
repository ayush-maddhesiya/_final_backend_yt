import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js"
import { loginUser, logoutUser, registerUser,refreshAccessToken } from "../controllers/user.controller.js";
import { veriftyJWT } from "../middlewares/auth.middlewares.js";
const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ])
    ,registerUser)

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(veriftyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)


export default router;