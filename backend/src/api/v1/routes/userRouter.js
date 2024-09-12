import { Router } from "express";
import {
  createUserHandler,
  loginUserHandler,
} from "../controllers/userController.js";

const userRouter = Router();

// Define routes for the user resource
userRouter.post("/", createUserHandler);
userRouter.post("/login", loginUserHandler);

export default userRouter;
