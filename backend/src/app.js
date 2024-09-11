import express from "express";
import initDBService from "./api/v1/services/initDBService.js";
import userRouter from "./api/v1/routes/userRouter.js";
import errorHandler from "./api/middleware/errorHandler.js";

const app = express();

initDBService();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/v1/users", userRouter);

app.use(errorHandler);

export default app;
