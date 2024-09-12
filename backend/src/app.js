import express from "express";
import initDBService from "./api/v1/services/initDBService.js";
import userRouter from "./api/v1/routes/userRouter.js";
import errorHandler from "./api/middleware/errorHandler.js";
import cors from "cors";

initDBService();

const app = express();

// Parse JSON request bodies
app.use(express.json());

// Allow requests with credentials from the docker network frontend service
app.use(
  cors({
    origin: `http://frontend:${process.env.FRONTEND_PORT}`,
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Mount the user router at the /api/v1/users path
app.use("/api/v1/users", userRouter);

// Mount the error handler middleware
app.use(errorHandler);

export default app;
