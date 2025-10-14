import express from "express";
import { getUser, userLogin, userRegister, verifyOTP } from "../controllers/userController.js";
import { verifyToken } from "../utils/verifyUser.js";

const userRouter = express.Router();

userRouter.post("/login",userLogin)
userRouter.post("/register",userRegister)
userRouter.get("/profile",verifyToken,getUser)
userRouter.post("/verify",verifyOTP)

export default userRouter