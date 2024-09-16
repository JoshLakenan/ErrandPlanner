import express from "express";
import initDBService from "./api/v1/services/initDBService.js";
import { initRedis } from "./api/v1/services/redisService.js";
import errorHandler from "./api/middleware/errorHandler.js";
import cors from "cors";
import userRouter from "./api/v1/routes/userRouter.js";
import locationRouter from "./api/v1/routes/locationRouter.js";
import pathRouter from "./api/v1/routes/pathRouter.js";

// Initialize the database and Redis services
initDBService();
initRedis();

// Create an Express application
const app = express();

// Parse JSON request bodies
app.use(express.json());

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like curl or Postman) or in the CORS_ORIGINS list
    if (!origin || process.env.CORS_ORIGINS.split(",").includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

// Mount routers for each resource on the v1 API
app.use("/api/v1/users", userRouter);
app.use("/api/v1/locations", locationRouter);
app.use("/api/v1/paths", pathRouter);

// Mount the error handler middleware
app.use(errorHandler);

export default app;
