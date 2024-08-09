import { Router } from "express";
import { signUp, login } from "../controllers/employee.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
//import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/signup').post(
   upload.fields([
    {
        name: "avatar",
        maxCount: 1
    }
   ]),
    signUp
);

router.route("/login").post(login)



export default router;