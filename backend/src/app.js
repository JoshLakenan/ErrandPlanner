import express from "express";
import initDBService from "./api/v1/services/initDBService.js";
import errorHandler from "./api/middleware/errorHandler.js";
import cors from "cors";
import userRouter from "./api/v1/routes/userRouter.js";
import locationRouter from "./api/v1/routes/locationRouter.js";

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

// Mount routers for each resource on the v1 API
app.use("/api/v1/users", userRouter);
app.use("/api/v1/locations", locationRouter);

// Mount the error handler middleware
app.use(errorHandler);

export default app;
