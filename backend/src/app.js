import express from "express";
import initDBService from "./services/initDBService.js";

const app = express();

initDBService();

app.get("/", (req, res) => {
  res.send("Hello World");
});

export default app;
