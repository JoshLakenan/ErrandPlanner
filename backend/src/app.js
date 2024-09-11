import express from "express";
import sequelize from "./models/index.js";
import User from "./models/user.js";

try {
  // Synchronize the models with the database
  await sequelize.sync({ force: false });
  console.log("All models were synchronized successfully.");
} catch (error) {
  throw new Error("Unable to synchronize the models with the database:", error);
}

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

export default app;
