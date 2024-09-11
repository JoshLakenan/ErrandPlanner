import { Router } from "express";
import { createUserHandler } from "../controllers/userController.js";

const userRouter = Router();

userRouter.post("/", createUserHandler);

export default userRouter;
