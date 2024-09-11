import express from "express";
import sequelize from "./models/index.js";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

export default app;
